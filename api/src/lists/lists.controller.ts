import {
	Controller,
	Body,
	Get,
	Post,
	Patch,
	Delete,
	UseGuards,
	UseInterceptors,
	Query,
	HttpCode,
	HttpStatus,
	Req,
	BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import { ListsService } from './lists.service';
import { ListAuthGuard } from './guards/list.guard';
import { RemoveListFieldsInterceptor } from './interceptors/remove-list-fields.interceptor';
import { RemoveListCreateFieldsInterceptor } from './interceptors/remove-list-create-fields.interceptor';
import { CreateListDto } from './dtos/create-list.dto';
import { UpdateListDto } from './dtos/update-list.dto';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { UpdateCommentDto } from './dtos/update-comment.dto';
import { CommentAuthorizationGuard } from '../users/guards/comment-auth.guard';
import { CloneListDto } from './dtos/clone-list.dto';
import { Public } from '../users/decorators/public.decorator';
import { ShareListAuthGuard } from './guards/share-list.guard';
import { ListPrivacyAuthGuard } from './guards/list-private.guard';

@Controller('lists')
export class ListsController {
	constructor(private listsService: ListsService) {}

	@UseInterceptors(RemoveListCreateFieldsInterceptor)
	@Public()
	@Get('/public/list')
	getPublicList(@Query('listId') listId: string) {
		return this.listsService.getPublicList(listId);
	}

	@UseInterceptors(RemoveListCreateFieldsInterceptor)
	@UseGuards(ListAuthGuard)
	@Get('/list')
	getList(@Query('listId') listId: string) {
		return this.listsService.getList(listId);
	}

	@UseInterceptors(RemoveListFieldsInterceptor)
	@Get('/')
	getLists(@Req() req: Request) {
		if (!req.user) throw new BadRequestException('req contains no user');
		return this.listsService.getLists(req.user.id);
	}

	@Get('/watched')
	getWatchedMovies(@Req() req: Request) {
		if (!req.user) throw new BadRequestException('req contains no user');
		return this.listsService.getWatchedMovies(req.user.id);
	}

	@UseInterceptors(RemoveListCreateFieldsInterceptor)
	@Post('/create')
	createList(@Body() body: CreateListDto, @Req() req: Request) {
		if (!req.user) throw new BadRequestException('req contains no user');
		return this.listsService.createList(body, req.user.id);
	}

	@UseGuards(ListAuthGuard)
	@UseInterceptors(RemoveListCreateFieldsInterceptor)
	@Post('/clone')
	cloneList(@Body() body: CloneListDto, @Req() req: Request) {
		if (!req.user) throw new BadRequestException('req contains no user');
		return this.listsService.cloneList(body, req.user.id);
	}

	@UseGuards(ListAuthGuard)
	@Get('/sharees')
	getSharees(@Query('listId') listId: string, @Req() req: Request) {
		if (!req.user) throw new BadRequestException('req contains no user');
		return this.listsService.getSharees(listId, req.user.id);
	}

	@UseInterceptors(RemoveListFieldsInterceptor)
	@UseGuards(ListAuthGuard, ShareListAuthGuard)
	@Post('/toggleShareByUsername')
	@HttpCode(HttpStatus.NO_CONTENT)
	async toggleShareListByUsername(
		@Body() { listId, username }: { listId: string; username: string },
		@Req() req: Request,
	) {
		if (!req.user) throw new BadRequestException('req contains no user');
		return this.listsService.toggleShareByUsername(
			listId,
			username,
			req.user.id,
		);
	}

	@UseInterceptors(RemoveListFieldsInterceptor)
	@UseGuards(ListAuthGuard, ShareListAuthGuard)
	@Post('/toggleShare')
	@HttpCode(HttpStatus.NO_CONTENT)
	async toggleShareList(
		@Body() { listId, email: shareeEmail }: { listId: string; email: string },
		@Req() req: Request,
	) {
		if (!req.user) throw new BadRequestException('req contains no user');
		return this.listsService.toggleShareList(listId, shareeEmail, req.user.id);
	}

	@UseInterceptors(RemoveListFieldsInterceptor)
	@UseGuards(ListAuthGuard)
	@Post('/comments')
	@HttpCode(HttpStatus.NO_CONTENT)
	async createComment(
		@Body() createCommentDto: CreateCommentDto,
		@Req() req: Request,
	) {
		if (!req.user) throw new BadRequestException('req contains no user');
		return this.listsService.createComment(createCommentDto, req.user.id);
	}

	@UseGuards(ListAuthGuard, CommentAuthorizationGuard)
	@Patch('/comments/update')
	@HttpCode(HttpStatus.NO_CONTENT)
	async updateComment(@Body() updateCommentDto: UpdateCommentDto) {
		return this.listsService.updateComment(updateCommentDto);
	}

	@UseGuards(ListAuthGuard, CommentAuthorizationGuard)
	@Delete('/comments/delete')
	@HttpCode(HttpStatus.NO_CONTENT)
	deleteComment(@Body() { commentId }: { commentId: string }) {
		return this.listsService.deleteComment(commentId);
	}

	@UseInterceptors(RemoveListFieldsInterceptor)
	@UseGuards(ListAuthGuard, ListPrivacyAuthGuard)
	@Patch('/updatePrivacy')
	@HttpCode(HttpStatus.NO_CONTENT)
	updateListPrivacy(@Body() { listId }: { listId: string }) {
		return this.listsService.updateListPrivacy(listId);
	}

	@UseInterceptors(RemoveListCreateFieldsInterceptor)
	@UseGuards(ListAuthGuard)
	@Patch('/update')
	updateList(@Body() body: UpdateListDto) {
		return this.listsService.updateList(body);
	}

	@UseInterceptors(RemoveListFieldsInterceptor)
	@Patch('/updateWatchedStatus')
	@HttpCode(HttpStatus.NO_CONTENT)
	updateWatchedStatus(
		@Body() { movieId }: { movieId: string },
		@Req() req: Request,
	) {
		if (!req.user) throw new BadRequestException('req contains no user');
		return this.listsService.updateWatchedStatus(movieId, req.user.id);
	}

	@UseInterceptors(RemoveListFieldsInterceptor)
	@UseGuards(ListAuthGuard)
	@Delete('/delete')
	@HttpCode(HttpStatus.NO_CONTENT)
	deleteList(@Body() { listId }: { listId: string }, @Req() req: Request) {
		if (!req.user) throw new BadRequestException('req contains no user');
		return this.listsService.deleteList(listId, req.user.id);
	}

	@UseInterceptors(RemoveListFieldsInterceptor)
	@UseGuards(ListAuthGuard)
	@Delete('/deleteMovie')
	@HttpCode(HttpStatus.NO_CONTENT)
	deleteMovie(
		@Body() { listId, movieId }: { listId: string; movieId: string },
		@Req() req: Request,
	) {
		if (!req.user) throw new BadRequestException('req contains no user');
		return this.listsService.deleteListItem(listId, movieId);
	}
}
