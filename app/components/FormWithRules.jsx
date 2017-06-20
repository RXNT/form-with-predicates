import React, {Component} from "react";
import Form from "react-jsonschema-form";
import PropTypes from "prop-types";
import predicate from 'is-predicate';

export default class FormWithRules extends Component {

    constructor(props) {
        super(props);

        let { schema, formData, uiSchema } = this.props;
        this.state = { schema, formData, uiSchema };

        this.ruleTracker = this.ruleTracker.bind(this);
        this.updateSchema = this.updateSchema.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        let { schema, formData, uiSchema } = nextProps;
        this.setState({ schema, formData, uiSchema });
    }

    // const rules = {
    //     "password": {
    //         "firstName": "emptyString"
    //
    //     },
    //     "telephone": {
    //         "age" : {
    //             "greater": "10"
    //         }
    //     }
    // };

    hideField(rule, formData) {
        if (typeof rule !== 'object') {
            console.error(`Rule ${rule} can't be processed`)
            return false;
        }
        return Object.
            keys(rule).
            every((refPred) => {
                let refVal = formData[refPred];
                if (refVal === undefined)
                    return false;
                let refPredRule = rule[refPred];
                if (typeof refPredRule === 'object') {
                    // Complicated rule - like { greater then 10 }
                    return Object.
                        keys(refPredRule).
                        every((pred) => {
                            let predToUse = predicate[pred];
                            let predValue = refPredRule[pred];
                            return predToUse(refVal, predValue);
                        });
                } else {
                    // Simple rule - like emptyString
                    return predicate[refPredRule](refVal)
                }
            })

    }

    updateSchema(rules, formData = {}) {
        let properties = Object.assign({}, this.props.schema.properties);
        let uiSchema = Object.assign({}, this.props.uiSchema);

        Object.
            keys(rules).
            map((field) => {
                if (this.hideField(rules[field], formData)) {
                    delete properties[field];
                    delete uiSchema[field];
                }
            });

        let schema = Object.assign({}, this.props.schema, { properties });
        this.setState({ schema, uiSchema: uiSchema, formData: Object.assign({}, formData) });
    }

    ruleTracker(state) {
        let {formData} = state;
        this.updateSchema(this.props.rules, formData);
        if (this.props.onChange) this.props.onChange(state);
    }

    render() {
        let configs = Object.assign({}, this.props);

        delete configs.schema;
        delete configs.formData;
        delete configs.onChange;
        delete configs.uiSchema;

        return (
            <div>
                <Form {...configs}
                      schema={this.state.schema}
                      uiSchema={this.state.uiSchema}
                      formData={this.state.formData}
                      onChange={this.ruleTracker}
                      onError={this.handleError}/>
            </div>
        )
    }
}

if (process.env.NODE_ENV !== "production") {
    FormWithRules.propTypes = {
        rules: PropTypes.object.isRequired
    };
}

