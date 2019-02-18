<template>
    <div class="condition-builder-component-wrapper">
        <div class="wrapper" @click="$refs.configModal.open()">
            <editor 
                    :template="input.data"
                    :schema="defaultStep.data"
                    :step="defaultStep"
                    :steps="[defaultStep]"
                    :readonly="true">
            </editor>
        </div>

        <or-modal ref="configModal" :remove-close-button="true"
                  title="Configure component"
                  class="input-message-settings"
                  :contain-focus="false">

            <or-switch v-model="input.data.isSingleExit">Use single exit</or-switch>

            <or-switch v-if="input.data.isSingleExit" v-model="input.data.conditionRuleHasDataOut">Condition rule has data out</or-switch>

            <or-switch v-if="input.data.isSingleExit && input.data.conditionRuleHasDataOut" v-model="input.data.hasNoConditionDataOut">Has data out if no condition is met</or-switch>

            <div slot="footer">
                <or-button color="primary"
                           type="secondary"
                           @click.prevent="$refs.configModal.close()">
                    Close
                </or-button>
            </div>
        </or-modal>
    </div>
</template>

<script>
    import _ from 'lodash';
    
    
    import editor from '../editor/editor.vue';
    let componentBase = () => {
        let component = null;
        try {
            component = require("@default/src/inputs/_design_base.vue");
            return require("@default/src/inputs/_design_base.vue").default;
        } catch (error) {
            return require("./../../src/../../../helpers/InputBaseMock.vue").default;
        }
    };
    export default {
        data(){
        return {
            input:{
                data:{
                    isSingleExit: null,
                    conditionRuleHasDataOut:false,
                    hasNoConditionDataOut:null

                }
            },
             defaultStep: {
                data: {}
            }
        }
        },
        extends    : componentBase(),

        components : {
            editor
        },

        defaultValue () {
            return _.cloneDeep(data);
        }
    };

    export const label = 'Conditon builder v0.6.0';
    export const data = {
        isSingleExit            : true,
        conditionRuleHasDataOut : true,
        hasNoConditionDataOut   : true,
        conditionExits          : [],
        conditionGroups         : [],
        noConditionDataOutValue : "``",
        mountedFlag             : false
    };

    export const meta = {
        name    : 'condition-builder-component',
        type    : 'onereach-studio-form-input',
        version : '0.6.0'
    };
</script>

<style scoped lang="scss" rel="stylesheet/scss">
    .condition-builder-component-wrapper {
        width: 100%;
    }
</style>