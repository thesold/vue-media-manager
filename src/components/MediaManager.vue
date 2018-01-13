<template>
    <div v-if="isVisible" class="mediamanager flex flex-col h-full pin fixed overflow-auto z-30 bg-white">
        <div class="flex-initial flex items-end">
            <div class="flex-1 text-right p-4">
                <span @click="toggleWindow" class="">
                    <svg class="h-8 w-8 fill-current text-teal hover:text-teal-dark" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                </span>
            </div>
        </div>
        <div class="flex-initial h-auto">
            <vue-dropzone
                ref="vueDropzone"
                id="dropzone"
                :options="dropzoneOptions"
                @vdropzone-success="fileUploaded"
            ></vue-dropzone>
        </div>
        <div class="flex-1 overflow-scroll">
            <div class="flex flex-wrap">
                <div 
                    v-for="item in filteredItems" 
                    :key="item.version" 
                    class="w-1/3 md:w-1/4 lg:w-1/6"
                    @click="selectItem(item)"
                >
                    <div class="rounded overflow-hidden shadow-lg m-4" :class="selectedClass(item)">
                        <img :src="item.thumbnail_url" :alt="item.filename" class="w-full max-w-full m-0 p-0">
                        <div class="px-4 py-2">
                            <div class="font-bold text-md text-grey-dark overflow-hidden whitespace-no-wrap">{{ item.filename }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex-initial m-2 p-2 text-right">
            <button
                @click="cancelMedia"
                class="bg-grey-darker hover:bg-grey-darkest text-white font-bold py-4 px-6 rounded text-xl"
                :class="{'text-black': isLoading}"
                :disabled="this.isLoading"
            >
                Cancel
            </button>
            <button
                v-if="resources.selected"
                @click="deleteSelectedResource"
                class="bg-red-dark hover:bg-red-darker text-white font-bold py-4 px-6 rounded text-xl"
            >
                Delete
            </button>
            <button 
                @click="returnMedia"
                v-if="resources.selected"
                class="bg-teal hover:bg-teal-dark text-white font-bold py-4 px-6 rounded text-xl"
            >
                Select
            </button>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import vue2Dropzone from 'vue2-dropzone'
    import 'vue2-dropzone/dist/vue2Dropzone.css'

    export default {
        name: 'MediaManager',

        components: {
            vueDropzone: vue2Dropzone,
        },

        props: {
            api: {
                type: String,
                required: true,
            },
            apikey: {
                type: String,
            },
            apisecret: {
                type: String,
            },
            library: {
                type: String,
                required: true,
            },
            selected: {
                type: Object,
                required: false,
                default: () => null,
            },
            value: {
                type: Boolean,
                required: true,
            },
            initial: {
                type: String,
                required: false,
                default: '',
            },
            mode: {
                type: String,
                required: false,
                default: 'thumb',
            },
            gravity: {
                type: String,
                required: false,
                default: 'auto',
            },
            width: {
                type: String,
                required: false,
                default: 1280,
            },
            height: {
                type: String,
                required: false,
                default: 1280,
            },
        },

        data() {
            return {
                resources: {
                    items: {},
                    selected: this.selected,
                },

                options: {
                    request: {
                        endpoint: `https://${this.api}/resources/upload`,
                    },
                },
                dropZone: {
                    element: '.drop-area',
                    dropActive: 'active',
                },
                dropzoneOptions: {
                    url: `https://${this.api}/resources/upload`,
                },

                searchKeyword: '',

                isLoading: false,
            }
        },

        computed: {
            apiBaseUrl: {
                get() {
                    return `https://${this.api}`
                },
            },

            isVisible: {
                get() {
                    return this.value
                },
            },

            filteredItems: {
                get() {
                    return this.resources.items
                },
            },
        },

        methods: {
            fetchResources() {
                axios.get(`${this.apiBaseUrl}/resources/image/${this.mode}/${this.width}/${this.height}/${this.gravity}`)
                    .then(result => result.data)
                    .then((output) => {
                        this.$set(this.resources, 'items', output)
                    })
                    .catch(err => console.log(err))
            },

            fileUploaded(file) {
                this.$refs.vueDropzone.removeFile(file)
                this.fetchResources()
            },

            deleteSelectedResource() {
                this.isLoading = true

                axios.delete(`${this.apiBaseUrl}/resources/delete/${this.resources.selected.public_id}`)
                    .then(() => {
                        this.isLoading = false
                        this.$set(this.resources, 'selected', null)
                        this.fetchResources()
                    })
                    .catch(err => console.log(err))
            },

            toggleWindow() {
                this.$emit('input', false)
            },

            selectItem(item) {
                if (this.resources.selected === item) return this.returnMedia()

                return this.$set(this.resources, 'selected', item)
            },

            selectedClass(item) {
                const isSelected = this.resources.selected === item

                return {
                    'border-4': isSelected,
                    'border-teal': isSelected,
                }
            },

            returnMedia() {
                this.$emit('mediaSelected', this.resources.selected.scaled_url)
                this.toggleWindow()
            },

            cancelMedia() {
                this.$emit('mediaCancelled')
                this.toggleWindow()
            },
        },

        mounted() {
            this.fetchResources()
        },
    }
</script>

<style>
    @import url('../../dist/style.css');
</style>
