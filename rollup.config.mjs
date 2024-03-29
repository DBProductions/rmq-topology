import jsdoc from 'rollup-plugin-jsdoc'

export default {
  input: 'src/main.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'public/scripts/script.min.js'
  },
  plugins: [
    jsdoc({
      args: [],
      config: 'jsdoc.config.json'
    })
  ]
}
