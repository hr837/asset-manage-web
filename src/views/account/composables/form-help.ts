import { EXP_Email, EXP_Phone } from '@/utils/regexp.util'

export const FormRules = {
  phone: [
    {
      required: true, message: '请输入手机号码', trigger: 'blur',
    },
    {
      pattern: EXP_Phone, message: '请输入正确的手机号码',
    },
  ],
  smsCode: [
    { required: true, message: '请输入手机验证码', trigger: 'blur' },
    { len: 6, message: '请输入6位验证码' },
  ],
  email: [
    {
      required: true, type: 'email', message: '请设置登录邮箱', trigger: 'blur',
    },
    {
      type: 'email', message: '请输入正确的邮箱地址',
    },
  ],
  settingPassword: [
    { required: true, message: '请设置登录密码', trigger: 'blur' },
    { min: 6, message: '登录密码长度不能少于6位' },
  ],
  loginPassword: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入密码登录',
    },
  ],
  loginAccount: [
    { required: true, trigger: 'blur', message: '请输入邮箱/手机号' },
    {
      validator: (_: unknown, value: string, callback: Function) => {
        if (EXP_Phone.test(value) || EXP_Email.test(value))
          callback()

        else
          callback(new Error('请输入正确的邮箱或者手机号码'))
      },
    },
  ],
  pictureCode: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入验证码',
    },
    {
      len: 4,
      message: '请输入4位验证码',
    },
  ],
}
