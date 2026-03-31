const { setWorldConstructor } = require('@wdio/cucumber-framework')

class CustomWorld {
  constructor() {
    this.selectedUser = null
    this.selectedAppRoles = []
    this.generatedClientRef = null
    this.previousClientRef = null
    this.response = null
  }
}

setWorldConstructor(CustomWorld)
