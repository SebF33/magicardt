<template>
  <div
    class="TextInput"
    :class="{ 'has-error': !!errorMessage, success: meta.valid }"
  >
    <label :for="name">{{ label }}</label>

    <input
      :name="name"
      :id="name"
      :type="type"
      v-model="message"
      autocomplete="off"
      :value="message"
      :placeholder="placeholder"
      @input="handleChange"
      @blur="handleBlur"
    />

    <p class="help-message" v-show="errorMessage || meta.valid">
      {{ errorMessage || successMessage }}
    </p>
  </div>
</template>

<script>
import { useField } from "vee-validate";
import { useModelWrapper } from "../utils/modelWrapper";

export default {
  props: {
    label: {
      type: String,
      required: true,
    },
    modelValue: String,
    name: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: "",
    },
    successMessage: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "text",
    },
    value: {
      type: String,
      default: "",
    },
  },

  setup(props, { emit }) {
    const { errorMessage, handleBlur, handleChange, meta } = useField(
      props.name,
      undefined,
      {
        initialValue: props.value,
      }
    );

    return {
      errorMessage,
      handleBlur,
      handleChange,
      message: useModelWrapper(props, emit, "modelValue"),
      meta,
    };
  },
};
</script>

<style scoped>
.TextInput {
  position: relative;
  margin-bottom: calc(1em * 1.5);
  width: 100%;
}

label {
  display: block;
  margin-bottom: 4px;
  width: 100%;
}

input {
  width: 100%;
  border-radius: 10px;
  border: 2px solid transparent;
  padding: 10px 6px;
  outline: none;
  background-color: var(--light-color);
  box-shadow: 0 0 3px 3px var(--darker-primary-color);
  transition: border-color 0.3s ease-in-out, color 0.3s ease-in-out,
    background-color 0.3s ease-in-out;
}

input:focus {
  border-color: var(--primary-color);
}

.help-message {
  position: absolute;
  bottom: calc(-1.7 * 1em);
  left: 0.6em;
  font-size: 15px;
}

.TextInput.has-error input {
  background-color: var(--error-bg-color);
  color: var(--error-color);
}

.TextInput.has-error input:focus {
  border-color: var(--error-color);
}

.TextInput.has-error .help-message {
  color: var(--error-color);
}

.TextInput.success input {
  background-color: var(--success-bg-color);
  color: var(--success-color);
}

.TextInput.success input:focus {
  border-color: var(--success-color);
}

.TextInput.success .help-message {
  color: var(--success-color);
}
</style>
