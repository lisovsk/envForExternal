export default `
<div>
<or-tabs type="text" class="flex" fullwidth>
  <or-tab title="Editor">
      <div style="margin-bottom:30px;">
        <or-checkbox 
          v-model="readonly"
        >Readonly</or-checkbox>
      </div>
    <!--<validation-step
    :invalid="invalid"
    >-->
    <step-editor
      :readonly="readonly"
      :schema.sync="schema"
      @step-validation="stepValidation"
    ></step-editor>
    <!--</validation-step>-->
  </or-tab>
  <or-tab title="Input">
    <step-input></step-input>
  </or-tab>
</or-tabs>
</div>
`;
