<template>
    <v-layout row justify-center fill-height>
        <v-dialog v-model="isVisible" transition="dialog-bottom-transition" fullscreen>
            <v-toolbar fixed>
                <v-toolbar-title>Media Manager</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn flat color="error" v-if="resources.selected" @click="deleteSelectedResource">
                    Delete
                </v-btn>
                <v-btn flat color="primary"
                    @click="returnMedia"
                    v-if="resources.selected"
                >
                    Select
                </v-btn>
                <v-btn icon @click="toggleWindow">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-flex fill-height white style="margin-top: 64px;">
                <v-card>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                    </v-card-actions>
                    <v-container fluid grid-list-lg>
                        <v-layout row wrap>
                            <v-flex xs4 md3 lg2>
                                <vue-dropzone style="height: 100%;"
                                    ref="vueDropzone"
                                    id="dropzone"
                                    :options="dropzoneOptions"
                                    @vdropzone-success="fileUploaded"
                                ></vue-dropzone>
                            </v-flex>
                            <v-flex xs4 md3 lg2
                                v-for="item in filteredItems"
                                :key="item.version"
                                @click="selectItem(item)"
                            >
                                <v-card flat tile full-width :dark="selectedClass(item)">
                                    <img :src="item.thumbnail_url" :alt="item.filename" style="width: 100%; max-width: 100%;">
                                    <v-card-title>{{ item.filename }}</v-card-title>
                                </v-card>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card>
            </v-flex>
        </v-dialog>
    </v-layout>
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
                set(value) {
                    this.value = value
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
                return this.resources.selected === item
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
</style>
