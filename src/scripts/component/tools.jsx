import React from 'react';
import $ from 'jquery';

var createReactClass = require('create-react-class');

/**
 * 环境切换
 */
var EnvSelector = createReactClass({
	changeEnv: function(event) {
		var name = event.target.value;
		this.props.doSwitchEnv(name);
	},
	render: function() {
		let options = this.props.envNames;
		let selected = this.props.currentEnv.name;
		let optionItems = [];
		options.forEach(function(op, index) {
			optionItems.push(
				<option key={index} value={op}>{op}</option>
			);
		});
		return (
			<div className="selector select">
				<select className="env-groups" value={selected} onChange={this.changeEnv}>
					{optionItems}
				</select>
			</div>
		);
	}
});

/*
 * 新增环境
 */
var AddEnv = createReactClass({
	add: function() {
		var name = window.prompt('新环境名称?');
		name && this.props.doAddEnv(name);
	},
	render: function() {
		return (
			<a className="add-env button" href="#" onClick={this.add} >新增环境</a>
		)
	}
});

/*
 * 删除环境
 */
var DelteEnv = createReactClass({
	del: function(e) {
		var sure = window.confirm("确认删除此环境?");
		if (!sure) {return;}
		var name = this.props.currentEnv.name;
		var envNames = this.props.envNames;
		(envNames.length > 1) && this.props.doDelEnv(name);
	},
	render: function() {
		return (
			<a className="remove-env button" href="#" onClick={this.del}>删除环境</a>
		)
	}
});

var Tools = createReactClass({
	render: function() {
		// console.log('render tools');
		return (
			<div className="m-title">
				<div className="tools">
					<div className="current field is-horizontal">
						<div className="field-label is-normal">
							<label className="label">当前环境</label>
						</div>
						<div className="field-body">
							<div className="field is-narrow">
								<EnvSelector envNames={this.props.envNames}
											currentEnv={this.props.currentEnv}
											doSwitchEnv={this.props.doSwitchEnv}/>
							</div>
							<div className="field is-narrow">
								<AddEnv doAddEnv={this.props.doAddEnv}/>
							</div>
							<div className="field is-narrow">
								<DelteEnv  currentEnv={this.props.currentEnv} doDelEnv={this.props.doDelEnv} envNames={this.props.envNames}/>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

export default Tools;
