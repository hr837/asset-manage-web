export const FormRules = {
  name: [
    { required: true, message: '请输入名称' },
    { pattern: /^[\w\u4E00-\u9FA5]{1,10}$/, message: '名称仅可包含汉字,字母,数字,下划线' },
  ],
  list: [
    { type: 'array', required: true, min: 1, message: '请添加文案' },
  ],
  sound: [
    { required: true, message: '请选择声音' },
  ],
}
