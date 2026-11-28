<template>
	<div class="flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-xs animate-pulse">
		<!-- Image Skeleton -->
		<div class="p-3 pb-0">
			<div class="aspect-[16/10] w-full rounded-xl bg-gray-200"></div>
		</div>

		<!-- Body Skeleton -->
		<div class="p-4 pt-3 flex flex-col flex-1 justify-between gap-3">
			<div class="space-y-2">
				<!-- Category & Date -->
				<div class="flex items-center justify-between">
					<div class="h-3 w-20 bg-gray-200 rounded"></div>
					<div class="h-3 w-16 bg-gray-200 rounded"></div>
				</div>

				<!-- Title -->
				<div class="h-4 w-full bg-gray-200 rounded"></div>
				<div class="h-4 w-4/5 bg-gray-200 rounded"></div>

				<!-- Excerpt -->
				<div class="space-y-1.5 pt-1">
					<div class="h-3 w-full bg-gray-100 rounded"></div>
					<div class="h-3 w-3/4 bg-gray-100 rounded"></div>
				</div>
			</div>

			<!-- Footer Link Skeleton -->
			<div class="pt-2">
				<div class="h-3 w-16 bg-emerald-100 rounded"></div>
			</div>
		</div>
	</div>
</template>
