import ImportController from './ImportController'
import StatementController from './StatementController'
import RecordController from './RecordController'

const Controllers = {
    ImportController: Object.assign(ImportController, ImportController),
    StatementController: Object.assign(StatementController, StatementController),
    RecordController: Object.assign(RecordController, RecordController),
}

export default Controllers