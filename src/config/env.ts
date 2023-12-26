import z from 'zod';

// dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = z.object({
    NODE_ENV: z.string().default('development'),
    PORT: z.string().default('5000'),
    CORS_ORIGIN: z.string().default('*'),
    // DATABASE_URL: z.string(),
    JWT_SECRET: z.string(),
    JWT_EXPIRES_IN: z.string().default('7d'),
});

const parsed = envVarsSchema.safeParse(Bun.env);

if (!parsed.success) {
    throw new Error(
        `Environment validation error: \n${parsed.error.issues
            .map(issue => `${issue.path.join('.')}: ${issue.message}`)
            .join('\n')}`,
    );
}

export const env = {
    nodeEnv: parsed.data.NODE_ENV,
    server: {
        port: parsed.data.PORT,
    },
    cors: {
        origin: parsed.data.CORS_ORIGIN,
    },
    // database: {
    //     url: parsed.data.DATABASE_URL,
    // },
    jwt: {
        secret: parsed.data.JWT_SECRET,
        expiresIn: parsed.data.JWT_EXPIRES_IN,
    },
};
