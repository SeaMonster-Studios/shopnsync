var Select2ArrowReplacer = function () {
	this.$newIcon = $('#form-select2-arrow').find('svg')
	this.$arrowWrappers = $('.select2-selection__arrow')

	if (this.$arrowWrappers.length) {
		this.replaceIcon()
	}
}

Select2ArrowReplacer.prototype.replaceIcon = function () {
	for (var i = 0; i <= this.$arrowWrappers.length; i++) {
		var $arrowWrapper = $(this.$arrowWrappers[i])

		if ($arrowWrapper.length) {
			$arrowWrapper.html(this.$newIcon.clone())
		}
	}
}

var SelectArrowReplacer = function () {
	this.$newIcon = $('#form-select2-arrow').find('svg')
	this.$arrowWrappers = $('.select')

	if (this.$arrowWrappers.length) {
		this.replaceIcon()
	}
}

SelectArrowReplacer.prototype.replaceIcon = function () {
	for (var i = 0; i <= this.$arrowWrappers.length; i++) {
		var $arrowWrapper = $(this.$arrowWrappers[i])

		if ($arrowWrapper.length) {
			$arrowWrapper.append(this.$newIcon.clone())
		}
	}
}
