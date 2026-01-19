/**
 * 原型文件处理模块
 * 处理压缩包解压、文件验证和注册
 */

import AdmZip from 'adm-zip'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * 解压并处理原型文件
 * @param {string} zipFilePath - 上传的 zip 文件路径
 * @param {string} prototypeName - 原型名称（用作文件夹名）
 * @returns {Object} 处理结果
 */
export async function processPrototypeZip(zipFilePath, prototypeName) {
  try {
    console.log(`📦 开始处理原型: ${prototypeName}`)

    // 1. 解压文件
    const zip = new AdmZip(zipFilePath)
    const zipEntries = zip.getEntries()

    console.log(`📂 压缩包包含 ${zipEntries.length} 个文件`)

    // 2. 验证文件结构
    const hasIndexHtml = zipEntries.some(entry =>
      entry.entryName === 'index.html' || entry.entryName.endsWith('/index.html')
    )

    if (!hasIndexHtml) {
      throw new Error('压缩包中必须包含 index.html 文件')
    }

    // 3. 确定目标目录
    const targetDir = path.join(__dirname, '../src/prototypes', prototypeName)

    // 如果目录已存在，先备份
    if (fs.existsSync(targetDir)) {
      const backupDir = `${targetDir}_backup_${Date.now()}`
      fs.renameSync(targetDir, backupDir)
      console.log(`📋 已备份旧版本到: ${backupDir}`)
    }

    // 4. 创建目标目录
    fs.mkdirSync(targetDir, { recursive: true })

    // 5. 解压文件到目标目录
    zip.extractAllTo(targetDir, true)
    console.log(`✅ 文件已解压到: ${targetDir}`)

    // 6. 验证必要文件
    const indexHtmlPath = path.join(targetDir, 'index.html')
    if (!fs.existsSync(indexHtmlPath)) {
      throw new Error('解压后未找到 index.html 文件')
    }

    // 7. 计算文件大小
    const fileSize = getDirectorySize(targetDir)

    // 8. 返回处理结果
    return {
      success: true,
      prototypeName,
      targetDir,
      filePath: `/src/prototypes/${prototypeName}/index.html`,
      fileSize,
      message: '原型文件处理成功'
    }
  } catch (error) {
    console.error('❌ 处理原型文件失败:', error)
    throw error
  } finally {
    // 清理临时文件
    if (fs.existsSync(zipFilePath)) {
      fs.unlinkSync(zipFilePath)
      console.log('🗑️  已清理临时文件')
    }
  }
}

/**
 * 计算目录大小
 * @param {string} dirPath - 目录路径
 * @returns {number} 目录大小（字节）
 */
function getDirectorySize(dirPath) {
  let size = 0

  const files = fs.readdirSync(dirPath)
  for (const file of files) {
    const filePath = path.join(dirPath, file)
    const stats = fs.statSync(filePath)

    if (stats.isDirectory()) {
      size += getDirectorySize(filePath)
    } else {
      size += stats.size
    }
  }

  return size
}
