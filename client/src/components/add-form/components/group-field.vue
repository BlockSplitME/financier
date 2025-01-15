<template>
  <v-combobox
    v-model="group.name"
    :class="`group-field__input-name-${label}`"
    :clearable="!isGroupNameEmpty"
    :items="groupsNames"
    :label="label"
    :placeholder="CONSTANTS.DEFAULT_GROUP_NAME as string"
    variant="outlined"
    @update:focused="onFocusedNameField"
    @update:search="updateSearch"
  />

  <v-textarea
    ref="textarea"
    v-model="group.description"
    :disabled="!isGroupNameChosen"
    label="Описание"
    no-resize
    :readonly="isGroupDescriptionReadonly"
    rows="3"
    variant="outlined"
    @update:focused="onFocusedDescriptionField"
  >
    <template #append-inner>
      <v-btn
        v-if="isGroupDescriptionReadonly && isGroupNameChosen"
        class="group-field__description-edit-btn"
        icon="mdi-pencil-outline"
        size="small"
        variant="text"
        @click="activatedEditDescription"
      />
    </template>
  </v-textarea>
</template>

<script setup lang="ts">
  import { PropType } from 'vue'
  import { CONSTANTS, TableGroupItemData, TransactionGroupPayload } from '@/types'

  const group = defineModel<TransactionGroupPayload>('modelValue', {
    type: Object as PropType<TransactionGroupPayload>,
    required: true,
  })

  const props = defineProps({
    groups: {
      type: Array as PropType<TableGroupItemData[]>,
      default: () => [] as TableGroupItemData[],
    },
    label: String,
  })

  const emits = defineEmits<{ fetchGroup: []}>()

  const isGroupDescriptionReadonly = ref<boolean>(true)
  const textarea = ref()

  const groupsNames = computed<string[]>(() => props.groups.filter(group => group.name !== CONSTANTS.DEFAULT_GROUP_NAME).map(group => group.name))
  const isGroupNameEmpty = computed<boolean>(() => Boolean(!(group.value.name ?? '').trim()))
  const isGroupNameChosen = computed<boolean>(() => !isGroupNameEmpty.value && group.value.name.trim() !== CONSTANTS.DEFAULT_GROUP_NAME)

  const onFocusedNameField = (focused: boolean) => {
    if (!focused) {
      if (!group.value.name || !(group.value.name.trim())) {
        group.value.name = CONSTANTS.DEFAULT_GROUP_NAME
      }
    }
  }
  const clearInput = () => {
    if (group.value.name && group.value.name.trim() === CONSTANTS.DEFAULT_GROUP_NAME) {
      group.value.name = ''
    }
  }

  const onFocusedDescriptionField = (focused: boolean) => {
    if (!isGroupDescriptionReadonly.value) isGroupDescriptionReadonly.value = !focused
  }
  const activatedEditDescription = () => {
    isGroupDescriptionReadonly.value = false
    textarea.value.focus()
  }
  const updateSearch = () => {
    emits('fetchGroup')
  }

  onMounted(() => {
    document.querySelector(`.group-field__input-name-${props.label} > .v-input__control `)?.addEventListener('click', clearInput)
  })
</script>

<style scoped lang="css">
.group-field__description-edit-btn {
  right: -10px;
  top: -15px;
}
</style>
