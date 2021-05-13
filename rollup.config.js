import typescript from '@rollup/plugin-typescript'
import compiler from '@ampproject/rollup-plugin-closure-compiler'

export default {
  input: 'src/main.ts',
  output: {
    dir: 'dist',
    format: 'cjs',
  },
  external: ['dotenv', 'telegraf', 'telegraf-session-redis', 'sugar', '@supabase/supabase-js'],
  plugins: [
    typescript({ module: 'esnext' }),
    compiler({
      formatting: 'SINGLE_QUOTES',
    }),
  ],
}
