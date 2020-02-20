# DEVELOPMENT

## Decorator

### Autobind
@AutoBind is short syntax when you need to specify the context with the handle function.

#### Example
```bash
htmlElement.addEventLister('click',this.handleEvent)
@AutoBind
handleEvent(){
...
}
```
