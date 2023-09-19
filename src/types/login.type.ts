import type { LoginInput } from '@/http/models/login.model'

export type LoginFormData = Omit<LoginInput, 'patchcaKey'>
