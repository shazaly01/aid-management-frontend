<!--src\views\areas\AreaTreeItem.vue-->
<template>
  <div class="area-tree-node">
    <div
      class="flex items-center justify-between py-3 border-b border-surface-border hover:bg-surface-border/30 transition-colors group"
      :style="{ paddingRight: `${level * 1.5}rem` }"
    >
      <div class="flex items-center gap-2">
        <button
          v-if="hasChildren"
          @click="toggleExpand"
          class="w-6 h-6 flex items-center justify-center text-text-muted hover:text-primary focus:outline-none transition-transform"
          :class="{ '-rotate-90': !isExpanded }"
        >
          ▼
        </button>
        <span v-else class="w-6 h-6 inline-block"></span>

        <span class="font-medium text-text-primary">{{ area.name }}</span>

        <span
          v-if="hasChildren"
          class="text-xs text-text-secondary bg-surface-border/50 px-2 py-0.5 rounded-full"
        >
          {{ area.children.length }}
        </span>
      </div>

      <div
        class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      >
        <button
          @click="$emit('add-child', area)"
          class="text-xs text-emerald-500 hover:text-emerald-400 px-2 py-1 bg-emerald-500/10 rounded font-bold"
        >
          + إضافة فرع
        </button>
        <button
          @click="$emit('edit', area)"
          class="text-xs text-blue-500 hover:text-blue-400 px-2 py-1 bg-blue-500/10 rounded font-bold"
        >
          تعديل
        </button>
        <button
          @click="$emit('delete', area.id)"
          class="text-xs text-rose-500 hover:text-rose-400 px-2 py-1 bg-rose-500/10 rounded font-bold"
        >
          حذف
        </button>
      </div>
    </div>

    <div v-if="isExpanded && hasChildren" class="border-r-2 border-surface-border mr-3">
      <AreaTreeItem
        v-for="child in area.children"
        :key="child.id"
        :area="child"
        :level="level + 1"
        @add-child="$emit('add-child', $event)"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  area: { type: Object, required: true },
  level: { type: Number, default: 0 },
})

const emit = defineEmits(['edit', 'delete', 'add-child'])

const isExpanded = ref(false)

const hasChildren = computed(() => props.area.children && props.area.children.length > 0)

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}
</script>
