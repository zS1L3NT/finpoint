import ImportController from './ImportController'
import StatementController from './StatementController'
import RecordController from './RecordController'
import CategoryController from './CategoryController'

const Controllers = {
    ImportController: Object.assign(ImportController, ImportController),
    StatementController: Object.assign(StatementController, StatementController),
    RecordController: Object.assign(RecordController, RecordController),
    CategoryController: Object.assign(CategoryController, CategoryController),
}

export default Controllers