const args = {
    paths: ['tests/cucumber/features/**/*.feature'],
    requireModule: ['ts-node/register'],
    require: ['tests/cucumber/step-definitions/**/*.ts'],
    format: ['progress-bar'],
};

module.exports = {
    default: args
};