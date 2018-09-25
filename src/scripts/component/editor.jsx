import React from 'react';
import $ from 'jquery';
var createReactClass = require('create-react-class');

import { EDIT_STATS } from '../action/action';

var Editor = createReactClass({
	render: function() {
		// console.log('render Editor');
		var currentEnv= this.props.currentEnv;
		var editState = currentEnv.editState;
		var hostContent = currentEnv.content;
		var editorShow;
		if (editState === EDIT_STATS.SAVED) {
			//展示界面
			var parsedHost = currentEnv.renderList;
			var groups = [];
			var hasGroups = parsedHost.length? true: false;
			parsedHost.forEach((group, number) => {
				var groupName = group.name;
				var groupIndex = group.index;
				var groupItems = group.items;
				var isGroupClose = group.close;
				var isAllUse = group.used;
				var hasOps = group.items.length? true: false;
				var items = [];
				groupItems.forEach((item, index) => {
					var itemKey = group.index + '-' + item.index;
					var display = itemKey === currentEnv.editingLine? 'block': 'none';
					var isInSearch = currentEnv.searchHost && (item.inputValue.indexOf(currentEnv.searchHost) >= 0);
					var inSearchClass = currentEnv.searchHost.trim()? (isInSearch? ' in-search': ' hide'): '';
					items.push(
						<div className={'line ' + (item.used? '': 'unuse') + inSearchClass}
							key={itemKey}
							data-index={item.index}
							data-group-name={groupName}
							data-key={itemKey}
							onDoubleClick={this.editLine}>
							<span className="ip">{item.ip}</span>
							<span className="host">{item.host}</span>
							<span className="comment">{item.comment|| ''}</span>
							<input className="edit-line"
								value={item.inputValue}
								onChange={this.changeInput}
								spellCheck="false"
								style={{"display": display}}/>
							<span className="operate" onClick={this.switchLineState}>√</span>
						</div>
					)
				});
				groups.push(
					<div className={"group " + (items.length? '': 'empty-group')} key={groupIndex} data-index={groupIndex}>
						<h3 className="group-name">{groupName}</h3>
						<div className="group-ops" style={{"display": (hasOps? 'block': 'none')}}>
							<span title="选择/取消" className={"op " + (isAllUse? '': 'unuse')} onClick={this.switchAllGroup}>√</span>
							<span title="展开/收起" className="op close-op" onClick={this.closeGroup}>{isGroupClose? '∨': '∧'}</span>
						</div>
						<div className="group-lines" style={{"display": (isGroupClose? 'none': 'block')}}>
							{items}
						</div>
					</div>
				);
			});
			editorShow = groups;
		} else {
			//编辑界面
			editorShow = (
				<div>
					<div className="field is-horizontal">
						<div className="field-label is-normal">
							<label className="label">编辑</label>
						</div>
						<div className="field-body">
							<div className="field">
								<p className="control is-expanded has-icons-left">
									<textarea spellCheck="false" className="js-editor editor-mod textarea" ref="editor" value={hostContent} onChange={this.changeContent}></textarea>
								</p>
							</div>
						</div>
					</div>
					<div className="field is-horizontal">
						<div className="field-label is-normal">
						</div>
						<div className="field-body">
							<div className="field is-narrow">
								<a className="save-content button" onClick={this.saveContent}>保存</a>
							</div>
							<div className="field is-narrow">
								<a className="cancle-content button" onClick={this.cancleContent}>取消</a>
							</div>
						</div>
					</div>
				</div>
			)
		}
		return (
			<section className="m-editor" onClick={this.saveLine}>
				<div className="field is-horizontal">
					<div className="field-label is-normal">
						<label className="label">编辑</label>
					</div>
					<div className="field-body">
						<a className="env-name button" onDoubleClick={this.goEditMode} >{currentEnv.name}
							<span className="tips">（双击编辑）</span>
							<span style={{"display": (hasGroups? 'block': 'none')}}>
								<span title="选择/取消" className={"env-op swich-all " + (currentEnv.allUse? '': 'unuse')} onClick={this.switchAllInEnv}>√</span>
								<span title="展开/收起" className="env-op close-all" onClick={this.closeAllInEnv}>{currentEnv.allClose? '∨': '∧'}</span>
							</span>
						</a>
					</div>
				</div>
				<div className="filter-host field is-horizontal">
					<div className="field-label is-normal">
						<label className="label">筛选</label>
					</div>
					<div className="field-body">
    					<div className="field">
							<div className="control">
								<input className="filter-input input" spellCheck="false" value={currentEnv.searchHost} onChange={this.searchHost}/>
							</div>
						</div>
					</div>
				</div>
				{editorShow}
			</section>
		);
	},
	editLine: function(e) {
		//打开编辑行的界面
		e.preventDefault();
		var editLine = this.props.currentEnv.editingLine;
		var target = e.target;
		var $line = $(target).closest('.line');
		var itemKey = $line.data('key');
		!editLine
		&& (!$(target).hasClass('operate'))
		&& (itemKey != editLine)
		&& this.props.doSwitchEditLine(itemKey);
	},
	saveLine: function(e) {
		//保存某行
		var editLine = this.props.currentEnv.editingLine;
		var target = e.target;
		var $line = $(target).closest('.line');
		var itemKey = $line.data('key');
		(editLine && itemKey != editLine) && this.props.doSaveEditInput();
	},
	changeInput: function(e) {
		// 保存input的值
		var target = e.target;
		var value = target.value;
		var $line = $(target).closest('.line');
		var itemKey = $line.data('key');
		this.props.doChangeEditInput(itemKey, value);
	},
	switchLineState: function(e) {
		//改变行的状态 选中/未选中
		var editLine = this.props.currentEnv.editingLine;
		var target = e.target;
		var $line = $(target).closest('.line');
		var itemKey = $line.data('key');
		if (!editLine) {
			this.props.doSwitchLineState(itemKey);
		}
	},
	switchAllGroup: function(e) {
		//启用/取消全组
		var target = e.target;
		var $group = $(target).closest('.group');
		var groupIndex = $group.data('index');
		this.props.doSwitchAllGroup(groupIndex);
	},
	closeGroup: function(e) {
		//展开/收起组
		var target = e.target;
		var $group = $(target).closest('.group');
		var groupIndex = $group.data('index');
		this.props.doCloseGroup(groupIndex);
	},
	changeGroupName: function(e) {
		//修改组名
		var target = e.target;
		var $group = $(target).closest('.group');
		var groupIndex = $group.data('index');
		this.props.doChangeGroupName(groupIndex);
	},
	goEditMode: function(e) {
		//进入编辑模式
		if ($(e.target).hasClass('env-op')) {return;}
		this.props.doGoEditMode();
	},
	changeContent: function(e) {
		//保存 content
		this.props.doChangeContent(e.target.value);
	},
	saveContent: function(e) {
		this.props.doSaveContent();
	},
	cancleContent: function(e) {
		this.props.doCancleContent();
	},
	switchAllInEnv: function(e) {
		this.props.doSwitchAllInEnv();
	},
	searchHost: function(e) {
		this.props.doSearchHost(e.target.value);
	},
	closeAllInEnv: function() {
		this.props.doCloseAllInEnv();
	}
});

export default Editor;
