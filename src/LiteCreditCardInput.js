import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  StyleSheet,
  Image,
  LayoutAnimation,
  TouchableOpacity,
  TextInput,
} from "react-native";

import Icons from "./LiteIcons";
import CCInput from "./CCInput";
import { InjectedProps } from "./connectToState";

const INFINITE_WIDTH = 1000;

const s = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: '#efeeee',
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 8,
  },
  icon: {
    width: 48,
    height: 40,
    resizeMode: "contain",
  },
  expanded: {
    flex: 1,
  },
  hidden: {
    width: 0,
  },
  leftPart: {
    overflow: "hidden",
  },
  rightPart: {
    overflow: "hidden",
    flexDirection: "row",
  },
  last4: {
    minWidth: 60,
    flex: 1,
    justifyContent: "flex-start",
  },
  numberInput: {
    width: INFINITE_WIDTH,
  },
  expiryInput: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    textAlign: 'center',
    width: 80,
    minWidth: 80,
  },
  cvcInput: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    textAlign:'right',
    maxWidth: 80,
    minWidth: 50
  },
  last4Input: {
    width: 60,
    marginLeft: 10,
    // flex: 1,
  },
  input: {
    height: 40,
    color: "black",
  },
});

/* eslint react/prop-types: 0 */ // https://github.com/yannickcr/eslint-plugin-react/issues/106
export default class LiteCreditCardInput extends Component {
  static propTypes = {
    ...InjectedProps,

    placeholders: PropTypes.object,

    inputStyle: Text.propTypes.style,

    validColor: PropTypes.string,
    invalidColor: PropTypes.string,
    placeholderColor: PropTypes.string,

    additionalInputsProps: PropTypes.objectOf(PropTypes.shape(TextInput.propTypes)),
  };

  static defaultProps = {
    placeholders: {
      number: "1234 5678 1234 5678",
      expiry: "MM/YY",
      cvc: "CVC",
    },
    validColor: "",
    invalidColor: "red",
    placeholderColor: "gray",
    additionalInputsProps: {},
  };

  componentDidMount = () => this._focus(this.props.focused);

  componentWillReceiveProps = newProps => {
    if (this.props.focused !== newProps.focused) this._focus(newProps.focused);
  };

  _focusNumber = () => this._focus("number");
  _focusExpiry = () => this._focus("expiry");

  _focus = field => {
    if (!field) return;
    this.refs[field].focus();
    LayoutAnimation.easeInEaseOut();
  }

  _inputProps = field => {
    const {
      inputStyle, validColor, invalidColor, placeholderColor,
      placeholders, values, status,
      onFocus, onChange, onBecomeEmpty, onBecomeValid,
      additionalInputsProps,
    } = this.props;

    return {
      inputStyle: [s.input, inputStyle],
      validColor, invalidColor, placeholderColor,
      ref: field, field,

      placeholder: placeholders[field],
      value: values[field],
      status: status[field],

      onFocus, onChange, onBecomeEmpty, onBecomeValid,
      additionalInputProps: additionalInputsProps[field],
    };
  };

  _iconToShow = () => {
    const { focused, values: { type } } = this.props;
    if (focused === "cvc" && type === "american-express") return "cvc_amex";
    if (focused === "cvc") return "cvc";
    if (type) return type;
    return "placeholder";
  }

  render() {
    const { focused, values: { number }, inputStyle, status: { number: numberStatus } } = this.props;
    const showRightPart = focused && focused !== "number";

    return (
      <View style={s.container}>
        <View style={[
          s.leftPart,
          showRightPart ? s.hidden : s.expanded,
        ]}>
          <CCInput {...this._inputProps("number")}
                   keyboardType="numeric"
                   containerStyle={s.numberInput} />
        </View>
        <TouchableOpacity onPress={showRightPart ? this._focusNumber : this._focusExpiry }>
          <Image style={s.icon} source={Icons[this._iconToShow()]} />
        </TouchableOpacity>
        <View style={[
          s.rightPart,
          showRightPart ? s.expanded : s.hidden,
        ]}>
          <TouchableOpacity onPress={this._focusNumber}
                            style={s.last4}>
            <View pointerEvents={"none"}>
              <CCInput field="last4"
                       keyboardType="numeric"
                       value={ numberStatus === "valid" ? number.substr(number.length - 4, 4) : "" }
                       inputStyle={[s.input, inputStyle]}
                       containerStyle={[s.last4Input]} />
            </View>
          </TouchableOpacity>
          <CCInput {...this._inputProps("expiry")}
                   keyboardType="numeric"
                   containerStyle={s.expiryInput}
                   styleInput={{textAlign:'right'}} />
          <CCInput {...this._inputProps("cvc")}
                   keyboardType="numeric"
                   containerStyle={s.cvcInput}
                   styleInput={{textAlign:'right'}} />
        </View>
      </View>
    );
  }
}
