/**
 * 将 json 对象解析，转化为编辑器可以处理的信息完整的结构
 * 每层对象包括
 * data // 节点对应的原始数据（非克隆）
 * path // 对象树中的路径 ex.['homeassistant','name']
 * schema // 探测出来的 schema，一般只有第一二级对象会包含
 * parent // 父节点的引用
 * type // 节点类型
 * value // 转化后的值
 */

export function parse(data, path, detect, schema = null, parent = null) {
  const noDetect = schema && schema.type;

  let kv = {
    data,
    path,
    schema: noDetect ? schema : detect(data, path || []),
    parent
  };
  // 对于 schema 定义成数组但是实际配置是单对象这样的特殊配置，强制转换成数组
  if (kv.schema.type === "array" && !Array.isArray(data)) {
    if (data !== null) {
      data = [data];
      kv.data = data;
    } else {
      data = [];
      kv.data = data;
    }
  }

  if (typeof data !== "object") {
    return Object.assign(kv, {
      type: typeof data,
      value: JSON.stringify(data)
    });
  } else if (data === null) {
    return Object.assign(kv, {
      type: "null",
      value: "null"
    });
  } else if (Array.isArray(data)) {
    let value = data.map((item, index) => {
      let pathCopy = path.slice();
      pathCopy.push(index);
      return parse(item, pathCopy, detect, kv.schema.items, kv); // 只有 schema 是父节点指定
    });
    return Object.assign(kv, {
      type: "array",
      value
    });
  } else {
    let keys = Object.keys(data);
    let value = keys.map(k => {
      let pathCopy = path.slice();
      pathCopy.push(k);
      return parse(
        data[k],
        pathCopy,
        detect,
        kv.schema.properties ? kv.schema.properties[k] : null,
        kv
      );
    });
    return Object.assign(kv, {
      type: "object",
      value
    });
  }
}
