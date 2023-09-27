﻿using Logistics.Shared;

namespace Logistics.Application.Common;

public abstract class PagedQuery<T> : Request<PagedResponseResult<T>>
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}