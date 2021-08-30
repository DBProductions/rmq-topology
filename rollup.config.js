import jsdoc from 'rollup-plugin-jsdoc'

export default {
  input: 'src/main.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'script.min.js'
  },
  plugins: [
    jsdoc({
      args: [],
      config: 'jsdoc.config.json'
    })
  ]
}
