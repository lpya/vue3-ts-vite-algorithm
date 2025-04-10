module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
    'node': true
  },
  'extends': [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    'plugin:@typescript-eslint/recommended'
  ],
  'overrides': [
  ],
  'parser': 'vue-eslint-parser',
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module',
    'parser': '@typescript-eslint/parser'
  },
  'plugins': [
    'vue',
    '@typescript-eslint'
  ],
  rules: {
    'semi': ['error', 'always'],
    'no-undef': 0,
    'no-var': 2, // 禁用var，用let和const代替
    'no-multi-spaces': 2,
    'space-in-parens': [2, 'never'],
    'no-else-return': 2, // 如果if语句里面有return,后面不能跟else语句
    'no-shadow': 0, // 外部作用域中的变量不能与它所包含的作用域中的变量或参数同名
    'arrow-spacing': 2, // =>的前/后括号
    'arrow-parens': 2, // 箭头函数用小括号括起来
    'comma-dangle': [2, 'never'], // 对象字面量项尾不能有逗号
    'comma-spacing': ['error', { 'before': false, 'after': true }], // 逗号后面加空格
    'spaced-comment': [0, 'always'], //
    'curly': [2, 'all'], // 必须使用 if(){} 中的{}
    'default-case': 2, // switch语句最后必须有default
    'eqeqeq': 2, // 必须使用全等
    'quotes': [2, 'single'], // 引号类型 `` "" ''
    // 'indent': [1, 2], // 缩进风格
    'indent': [2, 2, {
      'SwitchCase': 1
    }],
    'no-unused-vars': 1,
    'vue/html-indent': ['error', 2], // 调整 Vue 模板缩进规则
    'init-declarations': 0, // 声明时必须赋初值
    'max-len': [0, 80, 4], // 字符串最大长度
    'newline-after-var': [0, 'never'], // 变量声明后是否需要空一行
    'object-curly-spacing': [2, 'always'], // 大括号内是否允许不必要的空格
    // 'key-spacing': [2, { 'beforeColon': false, 'afterColon': true }],// 确保冒号后有空格
    'key-spacing': [2, { beforeColon: false, afterColon: true }], 
    'use-isnan': 2, // 禁止比较时使用NaN，只能用isNaN()
    'array-bracket-spacing': [2, 'never'], // 是否允许非空数组里面有多余的空格 
    'no-multiple-empty-lines': ['error', { 'max': 1 }],
    'space-infix-ops': 'error', 
    'vue/max-attributes-per-line': 0, // 换行
    'vue/multi-word-component-names': 0,
    'vue/no-unused-vars': 0,  
    'vue/html-self-closing': ['error', {
      'html': {
        'void': 'always', // void HTML元素必须始终是自关闭的
        'normal': 'never', // normal HTML元素不能自关闭
        'component': 'always'// Vue组件必须始终自动关闭
      },
      'svg': 'always', // svg元素必须始终是自关闭的
      'math': 'always' // MathML元素必须始终是自关闭的
    }],
    'vue/attributes-order': [ // 属性名顺序
      2,
      {
        order: [
          'DEFINITION',
          'LIST_RENDERING',
          'CONDITIONALS',
          'RENDER_MODIFIERS',
          'GLOBAL',
          ['UNIQUE', 'SLOT'],
          'TWO_WAY_BINDING',
          'OTHER_DIRECTIVES',
          'OTHER_ATTR',
          'EVENTS',
          'CONTENT'
        ],
        alphabetical: false
      }
    ],
    'vue/html-closing-bracket-newline': [ // 右括号换行
      0,
      {
        singleline: 'never',
        multiline: 'always'
      }
    ],
    'vue/v-on-event-hyphenation': [// 事件名横线隔开
      2,
      'always',
      {
        autofix: true,
        ignore: []
      }
    ],
    'vue/no-parsing-error': 'off',
    'space-before-function-paren': ['error', 'never'],
    'vue/valid-v-for': 'warn'
  }
};
