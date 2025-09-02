export function toCSV(obj) {
    if (!Array.isArray(obj)) obj = [obj];
    const headers = Object.keys(obj[0]);
    const rows = obj.map(row => headers.map(h => row[h]).join(","));
    return [headers.join(","), ...rows].join("\n");
  }
  
  export function toXML(obj) {
    let xml = "";
    for (let key in obj) {
      let value = obj[key];
      if (typeof value === "object") {
        xml += `<${key}>${toXML(value)}</${key}>`;
      } else {
        xml += `<${key}>${value}</${key}>`;
      }
    }
    return xml;
  }
  
  export function toYAML(obj) {
    let yaml = "";
    for (let key in obj) {
      yaml += `${key}: ${obj[key]}\n`;
    }
    return yaml;
  }
  