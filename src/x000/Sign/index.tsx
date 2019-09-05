/**
 * ```
 * 李鸿章 <poodll@163.com>
 * 6/27/2019, 3:57:15 PM
 * ```
 * doc comment of the file goes here
 */

/** Happy Coding */
import React, { useState, useEffect, useContext } from 'react';

import { Form, Icon, Input, Button, Checkbox, message } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { context } from '_base/Context';
// import Component from '_view/Component';

import { signin, forgetPword } from './fetch';

function Sign({
  form: { getFieldDecorator, validateFields },
}: FormComponentProps) {
  const [logging, setLogging] = useState(false);
  const { setContextState } = useContext(context);
  useEffect(() => {
    document.title = '请登录';
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        setLogging(true);
        signin(values)
          .then(data => {
            setContextState(data);
            setLogging(false);
          })
          .catch(err => {
            message.error(err);
            setLogging(false);
          });
      } else {
        console.error(err);
      }
    });
  };
  const handleForgetPword = () => {
    validateFields(['username'], (err, values) => {
      if (!err) {
        forgetPword(values)
          .then(msg => {
            message.success(msg);
          })
          .catch(err => {
            message.error(err);
          });
      } else {
        console.error(err);
      }
    });
  };
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Form
        className="-glob-box-shadow"
        onSubmit={handleSubmit}
        style={{
          backgroundColor: 'white',
          minWidth: '320px',
          padding: '48px 32px',
        }}>
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: '请输入电子邮箱' }],
          })(
            <Input
              name="username"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="电子邮箱"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: '请输入密码（不少于 8 位）',
                min: 8,
              },
            ],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              name="password"
              placeholder="密码"
            />
          )}
        </Form.Item>
        <Form.Item>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(<Checkbox>记住登录</Checkbox>)}
            <a className="login-form-forgot" onClick={handleForgetPword}>
              忘记密码
            </a>
          </div>
          <Button
            type="primary"
            htmlType="submit"
            loading={logging}
            style={{ width: '100%' }}>
            登录
          </Button>
          {/* <Icon type="login" /> <a href="">现在注册</a> */}
        </Form.Item>
      </Form>
    </div>
  );
}

export default Form.create()(Sign);
