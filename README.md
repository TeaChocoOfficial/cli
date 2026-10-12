<!-- -Path: 'README.md'-->

# @teachoco-dev/cli

A powerful CLI tool to create and manage project structure from YAML configuration files.

## Installation

```bash
npm install -g @teachoco-dev/cli@latest
```

## Commands

### `init`

Initialize a new project with a configuration file.

```bash
tcc init
```

### `format`

Format code files in the project.

```bash
tcc format ./path/to/project
```

## Configuration

### teachoco-dev.yaml

```yaml
$schema: https://raw.githubusercontent.com/TeaChocoOfficial/cli/main/structure.schema.json
workspaces:
    - name: react-app
      run: npm start
      pack: {}
      src:
          - type: folder
            name: My Files
            children:
                - type: folder
                  name: Documents
                  children:
                      - type: ts
                        name: resume
                        code:
                            - export default function resume() {
                            - '    return { name: "tea", age: 19 }'
                            - '}'
```

### tcc.config.json

```json
{
    "render": {
        "basePath": "./output",
        "structurePath": "./teachoco-dev.yaml",
        "watch": false
    }
}
```

## Features

- 📁 Generate project structure from YAML/JSON configuration
- 🔍 Scan existing directory and generate configuration
- 🔄 Watch mode for automatic re-rendering
- ⚡ Force mode to overwrite existing files
- 🎯 Support for multiple workspaces
- 📄 Support for TypeScript, TSX, and image files

## License

MIT

## Author

teachoco-official

## Repository

[GitHub](https://github.com/TeaChocoOfficial/cli)
