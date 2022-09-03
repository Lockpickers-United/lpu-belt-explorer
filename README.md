# lpu-belt-explorer
An interactive web app for exploring the Lockpickers United belt ranking system.

# Contributing
For data contributions, see [data.js](./src/data.js).
```javascript
// Template:
// Note that case and spelling matters, since filters are generated dynamically.
const example = {
    belt: 'Magenta',
    make: 'Make',
    model: 'Model',
    type: 'Pin Tumbler',
    notes: 'Some notes if you have any.',
    tags: [
        'Whatever'
    ],
    links: [
        {text: 'LinkText', url: 'http://some.url'}
    ],
    regions: [
        'SomeRegion'
    ]
}
```

For code/features, submit an issue and discuss first.

# Run locally
```
yarn dev
```

# Build for deploy
```
yarn build
```
