import RollupPluginVue from 'rollup-plugin-vue'
import RollupPluginBabel from 'rollup-plugin-babel'

export default {
    input: 'src/index.js',
    output: {
        file: 'dist/index.js',
        format: 'es',
    },
    external: [
        'axios',
        'vue2-dropzone',
        'vue2-dropzone/dist/vue2Dropzone.css',
    ],
    plugins: [
        RollupPluginVue({
            css: false,
        }),
        RollupPluginBabel(),
    ],
}
