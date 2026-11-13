const expoConfig = require('eslint-config-expo/flat');
const { defineConfig } = require('eslint/config');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', '.expo/*', 'uniwind-types.d.ts'],
  },
  {
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "JSXOpeningElement[name.name='ScrollView']:not(:has(JSXAttribute[name.name='showsVerticalScrollIndicator']))",
          message: 'ScrollView must set showsVerticalScrollIndicator={false}.',
        },
        {
          selector:
            "JSXOpeningElement[name.name='ScrollView']:not(:has(JSXAttribute[name.name='showsHorizontalScrollIndicator']))",
          message: 'ScrollView must set showsHorizontalScrollIndicator={false}.',
        },
        {
          selector:
            "JSXOpeningElement[name.name='FlatList']:not(:has(JSXAttribute[name.name='showsVerticalScrollIndicator']))",
          message: 'FlatList must set showsVerticalScrollIndicator={false}.',
        },
        {
          selector:
            "JSXOpeningElement[name.name='FlatList']:not(:has(JSXAttribute[name.name='showsHorizontalScrollIndicator']))",
          message: 'FlatList must set showsHorizontalScrollIndicator={false}.',
        },
      ],
    },
  },
]);
