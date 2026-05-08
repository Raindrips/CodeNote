<script setup lang="ts">
import { ref } from 'vue';
import type { Ref } from 'vue';

// 自动推导为 number
const count = ref(0);
let myCount = 11;
// 变量提升
const refCount = ref(myCount);

// 复杂类型建议显式指定
interface User {
    id: number;
    name: string;
}
const userInfo: Ref<User> = ref({ id: 1, name: 'Alex' });
// 或者使用泛型
const userList = ref<User[]>([{ id: 2, name: 'QWE' }]);

const myValue = ref('hello world');

function toTitleDate(params: type) {}
</script>

<template>
    <h1>id: {{ userInfo.id }}</h1>
    <h1>Name: {{ userInfo.name }}</h1>

    <h1>id: {{ userList[0].id }}</h1>
    <h1>name: {{ userList[0].name }}</h1>
    <p>myValue = {{ myValue }}</p>
    <p>refCount = {{ refCount }}</p>

    <div id="app">
        <button @click="count++">{{ count }}</button>
    </div>
    
</template>

<style scoped></style>
