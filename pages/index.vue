<template>
<div class="index-page">
    <div class="desktop-component">
        <desktop></desktop>
    </div>
    <div class="mobile-component">
        <mobile></mobile>
    </div>
</div>
</template>

<script>
export default {
    name: "index"
}
</script>

<style>
.desktop-component {
    display: block;
}
.mobile-component {
    display: none;
}
@media (max-width:1200px) {
    .desktop-component {
        display: none;
    }
    .mobile-component {
        display: block;
    }
}
</style>