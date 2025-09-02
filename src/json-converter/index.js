// src/json-converter/index.js

const JsonConverter = {
    toCSV(obj) {
      if (!Array.isArray(obj)) obj = [obj];
      const headers = Object.keys(obj[0]);
      const rows = obj.map(row => headers.map(h => row[h]).join(","));
      return [headers.join(","), ...rows].join("\n");
    },
  
    toXML(obj) {
      let xml = "";
      for (let key in obj) {
        let value = obj[key];
        if (typeof value === "object") {
          xml += `<${key}>${JsonConverter.toXML(value)}</${key}>`;
        } else {
          xml += `<${key}>${value}</${key}>`;
        }
      }
      return xml;
    },
  
    toYAML(obj) {
      let yaml = "";
      for (let key in obj) {
        yaml += `${key}: ${obj[key]}\n`;
      }
      return yaml;
    }
  };
  
  export default JsonConverter;
  