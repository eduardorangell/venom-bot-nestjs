export default () => ({
  // NestJS
  PORT: parseInt(process.env.PORT) || 3000,

  // file uploads
  FILE_UPLOAD_DIR: process.env.FILE_UPLOAD_DIR || './uploads',
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 20000000,
  MAX_FILES: parseInt(process.env.MAX_FILES) || 10,
  ALLOWED_FILETYPES:
    process.env.ALLOWED_FILETYPES ||
    'jpg|jpeg|png|gif|mp4|m4v|avif|webp|pdf|doc',

  // Venom
  MULTIDEVICE: process.env.MULTIDEVICE === 'true' ? true : false,
  FOLDER_TOKEN_NAME: process.env.FOLDER_TOKEN_NAME || './tokens',
  MKDIR_FOLDER_TOKEN: process.env.MKDIR_FOLDER_TOKEN || '',
  HEADLESS: process.env.HEADLESS === 'true' ? true : false,
  DEVTOOLS: process.env.DEVTOOLS === 'true' ? true : false,
  USE_CHROME: process.env.USE_CHROME === 'true' ? true : false,
  DEBUG: process.env.DEBUG === 'true' ? true : false,
  AUTO_CLOSE: parseInt(process.env.AUTO_CLOSE) || 60000,
  CREATE_PATH_FILE_TOKEN:
    process.env.CREATE_PATH_FILE_TOKEN === 'true' ? true : false,
  WAIT_FOR_LOGIN: process.env.WAIT_FOR_LOGIN === 'true' ? true : false,
});
