import React, {Component} from "react";
import Form from "react-jsonschema-form";
import PropTypes from "prop-types";
import predicate from 'is-predicate';
import { updateSchema } from "./conditions";

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

    hideField(rule, formData) {
        if (typeof rule !== 'object') {
            console.error(`Rule ${rule} can't be processed`)
            return false;
        }
        function check(refVal, refPredRule, predicate) {
            if (refVal === undefined)
                return false;
            if (Array.isArray(refPredRule)) {
                return refPredRule.every(rule => predicate[rule](refVal));
            } else if (typeof refPredRule === 'object') {
                // Complicated rule - like { greater then 10 }
                return Object.
                    keys(refPredRule).
                    every((pred) => {
                        if (pred === 'not') {
                            return check(refVal, refPredRule[pred], predicate.not)
                        } else {
                            let predToUse = predicate[pred];
                            let predValue = refPredRule[pred];
                            return predToUse(refVal, predValue);
                        }
                    });
            }  else {
                // Simple rule - like emptyString
                return predicate[refPredRule](refVal);
            }
        }
        return Object.
            keys(rule).
            every((refPred) => {
                let refVal = formData[refPred];
                let refPredRule = rule[refPred];
                return check(refVal, refPredRule, predicate);
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
        updateSchema(this.props.rules, formData);
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

