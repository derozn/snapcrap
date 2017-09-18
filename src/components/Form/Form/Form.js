import React, { Component } from 'react'

import { connect } from 'react-redux'

import PropTypes from 'prop-types'

/**
 *  formHoc
 *  @example
 *    formHoc({
        form: <NAME>
      })(<YOUR_COMPONENT>)
 *  @param  {Object} formProps
 *  @return {Function}
 */
const formHoc = (formProps) => (WrappedComponent) => {
  class Form extends Component {
    constructor (props) {
      super(props)

      /**
       *  validations
       *  @description Holds functions which correspond to form elements and will be used for validation
       *  @type {Array}
       */
      this.validations = []

      // Bind private functions
      this.registerValidation = this.registerValidation.bind(this)
      this.removeValidation = this.removeValidation.bind(this)
      this.isFormValid = this.isFormValid.bind(this)
      this.submit = this.submit.bind(this)
    }

    /**
     *  registerValidation
     *  @param  {Boolean} isValidFunc
     *  @description Will push a new validation function to the current stack
     *               Returning a function to remove the validation function if a component
     *               unmounts
     *  @return {Function}
     */
    registerValidation (isValidFunc) {
      this.validations = [...this.validations, isValidFunc]
      return () => { this.removeValidation(isValidFunc) }
    }

    /**
     *  removeValidation
     *  @param  {Function} ref
     *  @description Removes a specific validation function from the current stack
     *  @return {Void}
     */
    removeValidation (ref) {
      this.validations = this.validations.filter(filter => filter !== ref)
    }

    /**
     *  isFormValid
     *  @param  {Boolean}  showErrors
     *  @description Checks all validations and returns a boolean if form is valid or not
     *  @return {Boolean}
     */
    isFormValid (showErrors) {
      return this.validations.reduce((memo, isValidFunc) => {
        return isValidFunc(showErrors) && memo
      }, true)
    }

    /**
     * @param evt
     */
    submit (evt) {
      const { handleSubmit } = this.props

      if (evt && evt.preventDefault) {
        evt.preventDefault()
      }

      if (this.isFormValid(true)) {
        handleSubmit ? handleSubmit({...this.props.values}) : null
      }
    }

    /**
     *  getChildContext
     *  @return {Object}
     */
    getChildContext () {
      return {
        update: this.props.update,
        submit: this.submit,
        values: this.props.values,
        validators: this.props.validators,
        registerValidation: this.registerValidation,
        isFormValid: this.isFormValid,
        updateErrors: this.props.updateErrors,
        errors: this.props.errors
      }
    }

    render () {
      return (
        <WrappedComponent {...this.props} />
      )
    }
  }

  /**
   *  defaultProps
   *  @type {Object}
   */
  Form.defaultProps = {
    onSubmit: () => {},
    autocomplete: true
  }

  /**
   *  propTypes
   *  @type {Object}
   */
  Form.propTypes = {
    children: PropTypes.node,
    values: PropTypes.object,
    update: PropTypes.func,
    handleSubmit: PropTypes.func,
    autocomplete: PropTypes.bool
  }

  /**
   *  childContextTypes
   *  @type {Object}
   */
  Form.childContextTypes = {
    update: PropTypes.func,
    submit: PropTypes.func,
    values: PropTypes.object,
    registerValidation: PropTypes.func,
    isFormValid: PropTypes.func,
    validators: PropTypes.func,
    updateErrors: PropTypes.func,
    errors: PropTypes.object
  }

  const mapStateToProps = (state, ownProps) => {
    return {}
  }

  const mapDispatchToProps = (dispatch, ownProps) => {
    return {}
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(Form)
}

export default formHoc
