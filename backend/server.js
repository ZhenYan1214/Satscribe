const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');

const app = express();
const PORT = process.env.PORT || 3001;

// 中間件
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json());

// 靜態文件服務 - 提供上傳的圖片
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 確保uploads目錄存在
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer 配置 - 圖片上傳
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  // 檢查文件類型
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('不支援的圖片格式！請上傳 JPG, PNG, GIF 或 WebP 格式的圖片。'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB 限制
  }
});

// API 路由

// 健康檢查
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Satscribe Backend API 正常運行',
    timestamp: new Date().toISOString()
  });
});

// 圖片上傳 API
app.post('/api/upload/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: '沒有收到圖片文件'
      });
    }

    const originalPath = req.file.path;
    const optimizedPath = originalPath.replace(path.extname(originalPath), '-optimized.jpg');
    
    try {
      // 使用 Sharp 優化圖片
      await sharp(originalPath)
        .resize(800, 800, { 
          fit: 'inside',
          withoutEnlargement: true 
        })
        .jpeg({ 
          quality: 85,
          progressive: true 
        })
        .toFile(optimizedPath);

      // 刪除原始文件，保留優化後的文件
      fs.unlinkSync(originalPath);
      
      // 構建圖片URL
      const imageUrl = `http://localhost:${PORT}/uploads/${path.basename(optimizedPath)}`;
      
      // 獲取圖片信息
      const metadata = await sharp(optimizedPath).metadata();
      
      res.json({
        success: true,
        data: {
          imageUrl: imageUrl,
          filename: path.basename(optimizedPath),
          originalName: req.file.originalname,
          size: metadata.size,
          width: metadata.width,
          height: metadata.height,
          format: metadata.format
        },
        message: '圖片上傳成功！'
      });

    } catch (optimizeError) {
      console.error('圖片優化失敗:', optimizeError);
      
      // 如果優化失敗，直接使用原始圖片
      const imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
      
      res.json({
        success: true,
        data: {
          imageUrl: imageUrl,
          filename: req.file.filename,
          originalName: req.file.originalname,
          size: req.file.size
        },
        message: '圖片上傳成功！（未優化）'
      });
    }

  } catch (error) {
    console.error('圖片上傳錯誤:', error);
    res.status(500).json({
      success: false,
      error: '圖片上傳失敗：' + error.message
    });
  }
});

// NFT Metadata 生成 API
app.post('/api/nft/metadata', (req, res) => {
  try {
    const { name, description, imageUrl, creator, season, attributes } = req.body;
    
    if (!name || !imageUrl) {
      return res.status(400).json({
        success: false,
        error: 'NFT 名稱和圖片 URL 是必需的'
      });
    }

    const metadata = {
      name: name,
      description: description || '',
      image: imageUrl,
      external_url: `https://satscribe.com/nft/${creator}/${season}`,
      attributes: [
        {
          trait_type: "Creator",
          value: creator || "Unknown"
        },
        {
          trait_type: "Season",
          value: `Q${season} 2024`
        },
        {
          trait_type: "Membership",
          value: "VIP"
        },
        {
          trait_type: "Supply",
          value: "Limited Edition"
        },
        ...(attributes || [])
      ],
      properties: {
        category: "Subscription NFT",
        creators: [
          {
            address: creator,
            share: 100
          }
        ]
      }
    };

    res.json({
      success: true,
      data: {
        metadata: metadata,
        metadataUri: `data:application/json;base64,${Buffer.from(JSON.stringify(metadata)).toString('base64')}`
      },
      message: 'NFT Metadata 生成成功！'
    });

  } catch (error) {
    console.error('Metadata 生成錯誤:', error);
    res.status(500).json({
      success: false,
      error: 'Metadata 生成失敗：' + error.message
    });
  }
});

// 錯誤處理中間件
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: '圖片文件過大！請上傳小於 10MB 的圖片。'
      });
    }
  }
  
  console.error('伺服器錯誤:', error);
  res.status(500).json({
    success: false,
    error: error.message || '伺服器內部錯誤'
  });
});

// 404 處理
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: '找不到請求的 API 端點'
  });
});

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`🚀 Satscribe Backend API 已啟動`);
  console.log(`📡 伺服器運行於: http://localhost:${PORT}`);
  console.log(`📁 圖片上傳端點: http://localhost:${PORT}/api/upload/image`);
  console.log(`🖼️  靜態圖片服務: http://localhost:${PORT}/uploads/`);
});

module.exports = app;