(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.JsonConverter = factory());
})(this, (function () { 'use strict';

  // src/json-converter/index.js

  const JsonConverter = {
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
     * 将对象转换为XML格式字符串
     * @param {Object} obj - 要转换的对象
     * @param {string} [rootName="root"] - 根元素名称
     * @returns {string} XML格式字符串
     */
    toXML(obj, rootName = "root") {
      if (!obj) throw new Error("输入不能为空");

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
        if (typeof data !== "object" || data === null) {
          return `<${nodeName}>${escapeXml(data)}</${nodeName}>`;
        }

        if (Array.isArray(data)) {
          return data.map(item => convertToXml(item, nodeName)).join("");
        }

        let xml = `<${nodeName}>`;
        for (const key in data) {
          if (Object.prototype.hasOwnProperty.call(data, key)) {
            xml += convertToXml(data[key], key);
          }
        }
        xml += `</${nodeName}>`;
        return xml;
      };

      return convertToXml(obj, rootName);
    },

    /**
     * 将对象转换为YAML格式字符串
     * @param {Object} obj - 要转换的对象
     * @param {number} [indent=2] - 缩进空格数
     * @returns {string} YAML格式字符串
     */
    toYAML(obj, indent = 2) {
      if (!obj) throw new Error("输入不能为空");

      const convertToYaml = (data, currentIndent = 0) => {
        const currentSpaces = " ".repeat(currentIndent);

        if (typeof data !== "object" || data === null) {
          return `${String(data)}`;
        }

        if (Array.isArray(data)) {
          return data.map(item => {
            const itemStr = convertToYaml(item, currentIndent + indent);
            return `${currentSpaces}- ${itemStr.trim()}`;
          }).join("\n");
        }

        let yaml = "";
        for (const key in data) {
          if (Object.prototype.hasOwnProperty.call(data, key)) {
            const value = data[key];
            if (typeof value === "object" && value !== null) {
              yaml += `${currentSpaces}${key}:\n${convertToYaml(value, currentIndent + indent)}\n`;
            } else {
              yaml += `${currentSpaces}${key}: ${String(value)}\n`;
            }
          }
        }
        return yaml;
      };

      return convertToYaml(obj);
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

  return JsonConverter;

}));
