<template>
  <v-combobox
    v-model="group.name"
    :items="groupsNames"
    label="Группа"
    variant="outlined"
    @update:search="fetchGroup"
  />

  <v-textarea
    ref="textarea"
    v-model="group.description"
    :class="[
      {
        'test': isGroupDescriptionReadonly
      }
    ]"
    label="Описание группы"
    no-resize
    :readonly="isGroupDescriptionReadonly"
    rows="3"
    variant="outlined"
    @update:focused="onFocusedDescriptionField"
  >
    <template #append-inner />
  </v-textarea>

  <Teleport v-if="textarea" to="textarea">
    <v-btn
      v-if="isGroupDescriptionReadonly"
      class="group-field__description-edit-btn modal"
      icon="mdi-pencil-outline"
      size="small"
      variant="text"
      @click="activatedEditDescription"
    />
  </Teleport>
</template>

<script setup lang="ts">
  import { PropType } from 'vue'
  import { Group, TransactionGroupPayload } from '@/types'

  const group = defineModel<TransactionGroupPayload>('modelValue', {
    type: Object as PropType<TransactionGroupPayload>,
    required: true,
  })

  const props = defineProps({
    groups: {
      type: Array as PropType<Group[]>,
      default: () => [] as Group[],
    },
  })

  const emits = defineEmits<{ fetchGroup: []}>()
  const groupsNames = computed<string[]>(() => props.groups.map(group => group.name))
  const isGroupDescriptionReadonly = ref<boolean>(true)
  const textarea = ref()

  const onFocusedDescriptionField = (focused: boolean) => {
    if (!isGroupDescriptionReadonly.value) isGroupDescriptionReadonly.value = !focused
  }
  const activatedEditDescription = () => {
    isGroupDescriptionReadonly.value = false
    textarea.value.focus()
  }
  const fetchGroup = () => {
    emits('fetchGroup')
  }
</script>

<style scoped lang="css">
.group-field__description-edit-btn {
 --textarea-enclosed-text-slot-padding: 12px;
  right: -10px
}
textarea {
  background-color: red;
}
.modal {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
}
</style>
