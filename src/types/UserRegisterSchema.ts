import {z} from 'zod';

const userRegisterSchema = z.object({
	email: z.string().email(),
	password: z.string(),
});

export type UserRegisterData = z.infer<typeof userRegisterSchema>;
