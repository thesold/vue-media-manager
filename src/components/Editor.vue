<template>
    <div class="hello">
        <button @click="mediaManagerIsOpen = true">Select Image</button>
        <img :src="image" alt="" v-if="image">
        <media-manager
            api="cloudinaryproxy.dev"
            library="silvanite"
            v-model="mediaManagerIsOpen"
            :initial="image"
            width="800"
            height="450"
            gravity="face"
            @mediaSelected="value => image = value"
            @mediaCancelled="userClickedCancel"
        ></media-manager>
    </div>
</template>

<script>
export default {
    name: 'Editor',
    data() {
        return {
            mediaManagerIsOpen: false,
            image: '',
        }
    },

    methods: {
        userClickedCancel() {
            //
        },
    },
}
</script>

<style>
</style>
