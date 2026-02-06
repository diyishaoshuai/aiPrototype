/**
 * 从文件夹名生成文件路径
 * @param {string} folderName - 文件夹名称（如 "my-app" 或 "my_app"）
 * @returns {string} 生成的文件路径（如 "/prototypes/my-app.html"）
 */
export function generateFilePath(folderName) {
  // 验证文件夹名格式（允许小写字母、数字、连字符和下划线）
  const validFolderName = folderName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-_]/g, '')    // 只保留字母、数字、连字符和下划线
    .replace(/[-_]+/g, '-')         // 多个连字符或下划线合并为一个连字符
    .replace(/^-|-$/g, '')          // 移除首尾连字符

  return `/prototypes/${validFolderName}.html`
}

/**
 * 验证文件夹名是否有效
 * @param {string} folderName - 文件夹名称
 * @returns {string|null} 错误消息，如果验证通过则返回 null
 */
export function validateFolderName(folderName) {
  // 验证文件夹名是否有效
  if (!folderName || folderName.trim() === '') {
    return '文件夹名不能为空'
  }

  const cleaned = folderName.toLowerCase().trim()
  if (!/^[a-z0-9-_]+$/.test(cleaned)) {
    return '文件夹名只能包含小写字母、数字、连字符和下划线'
  }

  return null // 验证通过
}
