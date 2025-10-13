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

// 圖片處理配置
const imageConfigs = {
  avatar: {
    maxSize: 5 * 1024 * 1024, // 5MB
    dimensions: { width: 400, height: 400 },
    quality: 90,
    format: 'jpeg',
    description: '頭像圖片'
  },
  nft: {
    maxSize: 50 * 1024 * 1024, // 50MB
    dimensions: null, // 保持原始尺寸
    quality: 95,
    format: 'original', // 保持原始格式
    description: 'NFT 圖片'
  },
  general: {
    maxSize: 10 * 1024 * 1024, // 10MB
    dimensions: { width: 800, height: 800 },
    quality: 85,
    format: 'jpeg',
    description: '一般圖片'
  }
};

// 通用圖片上傳 API（保持向後兼容）
app.post('/api/upload/image', upload.single('image'), async (req, res) => {
  await handleImageUpload(req, res, 'general');
});

// 頭像上傳 API
app.post('/api/upload/avatar', upload.single('image'), async (req, res) => {
  await handleImageUpload(req, res, 'avatar');
});

// NFT 圖片上傳 API
app.post('/api/upload/nft', upload.single('image'), async (req, res) => {
  await handleImageUpload(req, res, 'nft');
});

// 圖片上傳處理函數
async function handleImageUpload(req, res, type) {
  const config = imageConfigs[type];
  
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: '沒有收到圖片文件'
      });
    }

    // 檢查文件大小
    if (req.file.size > config.maxSize) {
      return res.status(400).json({
        success: false,
        error: `文件過大！${config.description}最大允許 ${Math.round(config.maxSize / 1024 / 1024)}MB`
      });
    }

    const originalPath = req.file.path;
    const originalExt = path.extname(req.file.originalname);
    let processedPath = originalPath;
    let shouldOptimize = false;
    
    // 根據類型決定處理方式
    if (type === 'nft') {
      // NFT 圖片：保持原始格式和尺寸，僅做輕微優化
      if (config.format === 'original') {
        const nftPath = originalPath.replace(path.extname(originalPath), `-nft${originalExt}`);
        
        try {
          let sharpInstance = sharp(originalPath);
          
          // 只對 JPEG 進行品質優化，其他格式保持原樣
          if (originalExt.toLowerCase() === '.jpg' || originalExt.toLowerCase() === '.jpeg') {
            sharpInstance = sharpInstance.jpeg({ quality: config.quality, progressive: true });
          } else if (originalExt.toLowerCase() === '.png') {
            sharpInstance = sharpInstance.png({ quality: config.quality });
          }
          
          await sharpInstance.toFile(nftPath);
          processedPath = nftPath;
          shouldOptimize = true;
        } catch (optimizeError) {
          console.log('NFT 圖片優化失敗，使用原始文件:', optimizeError.message);
          // 如果優化失敗，直接使用原始文件
        }
      }
    } else {
      // 頭像和一般圖片：進行尺寸和格式優化
      const optimizedExt = config.format === 'jpeg' ? '.jpg' : `.${config.format}`;
      const optimizedPath = originalPath.replace(path.extname(originalPath), `-optimized${optimizedExt}`);
      
      try {
        let sharpInstance = sharp(originalPath);
        
        // 調整尺寸（如果指定）
        if (config.dimensions) {
          sharpInstance = sharpInstance.resize(config.dimensions.width, config.dimensions.height, { 
            fit: type === 'avatar' ? 'cover' : 'inside',
            withoutEnlargement: type !== 'avatar'
          });
        }
        
        // 應用格式和品質設置
        if (config.format === 'jpeg') {
          sharpInstance = sharpInstance.jpeg({ 
            quality: config.quality,
            progressive: true 
          });
        } else if (config.format === 'png') {
          sharpInstance = sharpInstance.png({ quality: config.quality });
        }
        
        await sharpInstance.toFile(optimizedPath);
        processedPath = optimizedPath;
        shouldOptimize = true;
      } catch (optimizeError) {
        console.error(`${config.description}優化失敗:`, optimizeError);
        // 優化失敗時使用原始文件
      }
    }
    
    // 如果有處理過的文件，刪除原始文件
    if (shouldOptimize && processedPath !== originalPath) {
      try {
        fs.unlinkSync(originalPath);
      } catch (deleteError) {
        console.warn('刪除原始文件失敗:', deleteError.message);
      }
    }
    
    // 構建圖片URL
    const filename = path.basename(processedPath);
    const imageUrl = `http://localhost:${PORT}/uploads/${filename}`;
    
    // 獲取最終圖片信息
    const metadata = await sharp(processedPath).metadata();
    
    res.json({
      success: true,
      data: {
        imageUrl: imageUrl,
        filename: filename,
        originalName: Buffer.from(req.file.originalname, 'latin1').toString('utf8'),
        size: metadata.size || req.file.size,
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        type: type,
        optimized: shouldOptimize
      },
      message: `${config.description}上傳成功！`
    });

  } catch (error) {
    console.error(`${config.description}上傳錯誤:`, error);
    res.status(500).json({
      success: false,
      error: `${config.description}上傳失敗：` + error.message
    });
  }
}

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