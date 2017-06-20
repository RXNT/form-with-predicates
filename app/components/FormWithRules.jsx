import React, {Component} from "react";
import Form from "react-jsonschema-form";
import PropTypes from "prop-types";
///import is from "@pwn/is";

const is = {
    emptyString: function (v) {
        return v === undefined || v === null || (typeof v === "string" && v.trim().length === 0)
    }
}

export default class FormWithRules extends Component {
    constructor(props) {
        super(props);

        let initState = this.updateSchema(this.props.rules, this.props.schema, this.props.formData);
        this.state = {schema: initState, formData: this.props.formData};

        this.ruleTracker = this.ruleTracker.bind(this);
        this.updateSchema = this.updateSchema.bind(this);
        this.handleError = this.handleError.bind(this);
    }

    updateSchema(rules, schema, formData) {
        let updatedSchema = Object.assign({}, schema);
        formData = formData === undefined ? {} : formData;
        Object.keys(rules).map((field) => {
            Object.keys(rules[field]).map((predicate) => {
                let relFields = rules[field][predicate];
                let show = true;
                if (Array.isArray(relFields)) {
                    show = relFields.every((rel) => is[predicate](formData[rel]));
                } else {
                    show = is[predicate](formData[relFields]);
                }
                if (!show) {
                    delete updatedSchema.properties[field];
                }
            });
        });
        return updatedSchema;
    }

    ruleTracker(state) {
        let {formData} = state;
        let schema = this.updateSchema(this.props.rules, this.props.schema, formData);
        this.setState({schema, formData});
        if (this.props.onChange) this.props.onChange(state);
    }

    handleError(err) {
        console.log(err);
    }

    render() {
        let configs = Object.assign({}, this.props);

        delete configs.schema;
        delete configs.formData;
        delete configs.onChange;

        return (
            <div>
                <Form {...configs} schema={this.state.schema} formData={this.state.formData} onChange={this.ruleTracker} onError={this.handleError}/>
            </div>
        )
    }
}

if (process.env.NODE_ENV !== "production") {
    FormWithRules.propTypes = {
        rules: PropTypes.object.isRequired
    };
}

