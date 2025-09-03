// src/json-converter/index.js

const JsonConverter = {
  /**
   * 解析JSON字符串为JavaScript对象
   * @param {string} jsonString - 要解析的JSON字符串
   * @returns {Object|null} 解析后的对象，如果解析失败则返回null
   */
  parseJSON(jsonString) {
    if (typeof jsonString !== 'string') {
      console.error("Invalid input: expected a string, got", typeof jsonString);
      return null;
    }

    if (jsonString.trim() === '') {
      console.error("Invalid JSON string: empty string");
      return null;
    }

    try {
      return JSON.parse(jsonString);
    } catch (e) {
      console.error("Invalid JSON string:", e.message);
      return null;
    }
  },
  validateJSON(jsonString) {
    if (typeof jsonString !== 'string') {
      return {
        isValid: false,
        error: 'Input must be a string',
        parsedValue: null
      };
    }
    
    try {
      const obj = JSON.parse(jsonString);
      return {
        isValid: true,
        error: null,
        parsedValue: obj
      };
    } catch (e) {
      return {
        isValid: false,
        error: e.message,
        parsedValue: null
      };
    }
  },
  /**
   * 将对象转换为CSV格式字符串
   * @param {Object|Array} obj - 要转换的对象或对象数组
   * @returns {string} CSV格式字符串
   */
  toCSV(obj) {
    if (!obj) throw new Error("输入不能为空");

    // 确保输入是数组
    const data = Array.isArray(obj) ? obj : [obj];
    if (data.length === 0) return "";

    // 获取所有可能的列名
    const headersSet = new Set();
    data.forEach(item => {
      Object.keys(item).forEach(key => headersSet.add(key));
    });
    const headers = Array.from(headersSet);

    // 构建CSV行
    const escapeCsvValue = (value) => {
      if (value === null || value === undefined) return "";
      const stringValue = String(value);
      // 如果包含逗号、换行符或双引号，则需要用双引号包裹并转义内部的双引号
      if (stringValue.includes(",") || stringValue.includes("\n") || stringValue.includes('"')) {
        return `"$${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };

    const rows = data.map(row =>
      headers.map(header => escapeCsvValue(row[header])).join(",")
    );

    return [headers.join(","), ...rows].join("\n");
  },

  /**
   * 将对象转换为 XML 格式字符串
   * @param {Object} obj - 要转换的对象
   * @param {string} [rootName="root"] - 根元素名称
   * @returns {string} XML 格式字符串
   */
  toXML(obj, rootName = "root") {
    if (obj === null || obj === undefined) {
      console.error("[toXML] 输入不能为空");
      return "";
    }

    rootName = rootName || "root";

    const escapeXml = (unsafe) => {
      if (unsafe === null || unsafe === undefined) return "";
      return String(unsafe)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
    };

    const convertToXml = (data, nodeName) => {
      // 基本类型
      if (typeof data !== "object" || data === null) {
        return `<${nodeName}>${escapeXml(data)}</${nodeName}>`;
      }

      // 数组
      if (Array.isArray(data)) {
        if (data.length === 0) return `<${nodeName}/>`;
        return data.map(item => convertToXml(item, nodeName)).join("");
      }

      // 对象
      const keys = Object.keys(data);
      if (keys.length === 0) return `<${nodeName}/>`;
      
      const innerXml = keys.map(key => convertToXml(data[key], key)).join("");
      return `<${nodeName}>${innerXml}</${nodeName}>`;
    };

    return convertToXml(obj, rootName);
  },

  /**
   * 格式化JSON字符串，添加缩进和换行
   * @param {string|Object} json - JSON字符串或对象
   * @param {number} [indent=2] - 缩进空格数
   * @returns {string} 格式化后的JSON字符串
   */
  format(json, indent = 2) {
    if (json === undefined || json === null) {
      throw new Error("输入不能为空");
    }

    try {
      const obj = typeof json === 'string' ? JSON.parse(json) : json;
      return JSON.stringify(obj, null, indent);
    } catch (error) {
      throw new Error(`无效的JSON格式: ${error.message}`);
    }
  },

  /**
   * 压缩JSON字符串，移除所有空白字符
   * @param {string|Object} json - JSON字符串或对象
   * @returns {string} 压缩后的JSON字符串
   */
  minify(json) {
    if (json === undefined || json === null) {
      throw new Error("输入不能为空");
    }

    try {
      const obj = typeof json === 'string' ? JSON.parse(json) : json;
      return JSON.stringify(obj);
    } catch (error) {
      throw new Error(`无效的JSON格式: ${error.message}`);
    }
  }
};

export default JsonConverter;
