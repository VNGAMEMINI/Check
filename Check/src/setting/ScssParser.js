//? ========================================
//* SCSS PARSER — v2.0
//? ========================================
class ScssParser {
  /**
   * @param {string} scssContent - Nội dung mã nguồn SCSS
   * @param {object} [options]
   * @param {number}  [options.maxResolvePass=10] - Số vòng lặp tối đa khi resolve chain vars
   * @param {boolean} [options.strict=false]       - Ném lỗi khi var không tìm thấy thay vì giữ nguyên
   */
  constructor(scssContent, options = {}) {
    this.scss = scssContent || "";
    this.options = {
      maxResolvePass: 10,
      strict: false,
      ...options,
    };

    this.scssVars = {}; // $var  → value
    this.rootVars = {}; // --var → value (resolved)

    this._warnings = [];
  }

  //? ========================================
  //* LOAD — đồng bộ
  //? ========================================
  load(content) {
    if (content !== undefined) this.scss = content;
    return this;
  }

  //? ========================================
  //* LOAD — bất đồng bộ
  //? ========================================
  async loadAsync(content) {
    return this.load(content);
  }

  //? ========================================
  //* STRIP COMMENTS
  //* Loại bỏ // ... và /* ... */ trước khi parse
  //? ========================================
  _stripComments(src) {
    // Xóa block comments /* ... */ (kể cả multiline)
    src = src.replace(/\/\*[\s\S]*?\*\//g, "");
    // Xóa line comments // ... (không nằm trong string)
    src = src.replace(/\/\/[^\n]*/g, "");
    return src;
  }

  //? ========================================
  //* PARSE SCSS VARIABLES  $var: value;
  //* Hỗ trợ: !default, multiline, reference sang $var khác
  //? ========================================
  parseScssVars() {
    const clean = this._stripComments(this.scss);

    // Match $var: <value> kết thúc bằng ; (có thể có !default)
    const RE = /\$([\w-]+)\s*:\s*((?:[^;{}]|\n)+?)\s*(?:!default\s*)?;/g;
    let m;
    while ((m = RE.exec(clean)) !== null) {
      const name = m[1];
      const value = m[2].trim().replace(/\s+/g, " ");
      // Chỉ set lần đầu nếu là !default (giống SCSS semantics)
      if (!(name in this.scssVars)) {
        this.scssVars[name] = value;
      }
    }

    // Resolve $a: $b — nhiều pass cho đến khi ổn định
    this._resolveScssVarChain();
    return this;
  }

  //? ========================================
  //* RESOLVE SCSS VAR CHAIN
  //* $spacing: 8px; $gap: $spacing; → $gap = "8px"
  //? ========================================
  _resolveScssVarChain() {
    const RE_REF = /^\$([\w-]+)$/;
    for (let pass = 0; pass < this.options.maxResolvePass; pass++) {
      let changed = false;
      for (const [key, val] of Object.entries(this.scssVars)) {
        const ref = RE_REF.exec(val.trim());
        if (ref && this.scssVars[ref[1]] !== undefined) {
          this.scssVars[key] = this.scssVars[ref[1]];
          changed = true;
        }
      }
      if (!changed) break;
    }
  }

  //? ========================================
  //* PARSE ROOT VARIABLES
  //* Gom tất cả block :root {} (kể cả nhiều block)
  //? ========================================
  parseRootVars() {
    const clean = this._stripComments(this.scss);

    // Match nhiều block :root { ... }
    const RE_ROOT = /:root\s*\{([^}]*)\}/g;
    let rootBlock;
    while ((rootBlock = RE_ROOT.exec(clean)) !== null) {
      const content = rootBlock[1];
      const RE_VAR = /(--[\w-]+)\s*:\s*([^;]+);/g;
      let m;
      while ((m = RE_VAR.exec(content)) !== null) {
        let value = m[2].trim().replace(/\s+/g, " ");

        // Thay #{$var} → giá trị SCSS
        value = value.replace(/#\{\s*\$([\w-]+)\s*\}/g, (_, varName) => {
          const resolved = this.scssVars[varName];
          if (resolved === undefined) {
            this._warn(
              `SCSS var $${varName} không tìm thấy (dùng trong #{...})`,
            );
            return "";
          }
          return resolved;
        });

        // Thay $var trực tiếp trong giá trị
        value = value.replace(/\$([\w-]+)/g, (full, varName) => {
          const resolved = this.scssVars[varName];
          if (resolved === undefined) {
            this._warn(`SCSS var $${varName} không tìm thấy`);
            return full;
          }
          return resolved;
        });

        this.rootVars[m[1]] = value;
      }
    }
    return this;
  }

  //? ========================================
  //* RESOLVE CSS VARS — nhiều pass (xử lý chain)
  //* --a: var(--b); --b: var(--c); --c: red → --a = red
  //? ========================================
  resolveCssVars() {
    const RE_VAR = /var\((--[\w-]+)(?:\s*,\s*([^)]+))?\)/g;

    for (let pass = 0; pass < this.options.maxResolvePass; pass++) {
      let changed = false;

      for (const key of Object.keys(this.rootVars)) {
        const newVal = this.rootVars[key].replace(
          RE_VAR,
          (full, cssVar, fallback) => {
            const resolved = this.rootVars[cssVar];

            if (resolved !== undefined && resolved !== full) {
              changed = true;
              return resolved;
            }

            // Dùng fallback nếu có
            if (fallback !== undefined) {
              changed = true;
              return fallback.trim();
            }

            if (this.options.strict) {
              throw new Error(
                `[ScssParser] CSS var ${cssVar} không tìm thấy (strict mode)`,
              );
            }

            this._warn(`CSS var ${cssVar} không thể resolve`);
            return full; // giữ nguyên var(...)
          },
        );

        if (newVal !== this.rootVars[key]) {
          this.rootVars[key] = newVal;
        }
      }

      if (!changed) break;
    }

    return this;
  }

  //? ========================================
  //* INTERNAL WARN
  //? ========================================
  _warn(msg) {
    this._warnings.push(msg);
  }

  //? ========================================
  //* RUN ALL
  //? ========================================
  parse() {
    return this.parseScssVars().parseRootVars().resolveCssVars();
  }

  //? ========================================
  //* ASYNC PARSE
  //? ========================================
  async parseAsync() {
    return this.parseScssVars().parseRootVars().resolveCssVars();
  }

  //? ========================================
  //* OUTPUT — Array
  //? ========================================
  toArray() {
    // Gộp cả biến SCSS ($) và biến CSS (--) để hiển thị đầy đủ
    const scssList = Object.entries(this.scssVars).map(([name, value]) => ({
      name: `$${name}`,
      value,
    }));

    const rootList = Object.entries(this.rootVars).map(([name, value]) => ({
      name,
      value,
    }));

    return [...scssList, ...rootList];
  }

  //? ========================================
  //* OUTPUT — Object
  //? ========================================
  toObject() {
    return { ...this.rootVars };
  }

  //? ========================================
  //* OUTPUT — JSON string
  //? ========================================
  toJson(indent = 2) {
    return JSON.stringify(this.rootVars, null, indent);
  }

  //? ========================================
  //* GET — lấy 1 biến
  //? ========================================
  get(name) {
    return this.rootVars[name] ?? null;
  }

  //? ========================================
  //* HAS — kiểm tra tồn tại
  //? ========================================
  has(name) {
    return name in this.rootVars;
  }

  //? ========================================
  //* FILTER — lọc theo prefix hoặc regex
  //* filter("--color")    → tất cả var bắt đầu bằng --color
  //* filter(/^--spacing/) → dùng regex
  //? ========================================
  filter(pattern) {
    const test =
      pattern instanceof RegExp
        ? k => pattern.test(k)
        : k => k.startsWith(pattern);

    return Object.fromEntries(
      Object.entries(this.rootVars).filter(([k]) => test(k)),
    );
  }

  //? ========================================
  //* WARNINGS — xem cảnh báo parse
  //? ========================================
  get warnings() {
    return [...this._warnings];
  }

  //? ========================================
  //* STATS — thống kê nhanh
  //? ========================================
  get stats() {
    return {
      scssVarCount: Object.keys(this.scssVars).length,
      cssVarCount: Object.keys(this.rootVars).length,
      warningCount: this._warnings.length,
    };
  }
}

export default ScssParser;
