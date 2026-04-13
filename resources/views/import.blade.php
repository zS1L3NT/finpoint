@extends("base")
@section("Import Bank Statements")
@section("main")

    <h1>Import Bank Statements</h1>

    <form method="POST" enctype="multipart/form-data" action="{{ route("import.store") }}" class="m-auto vstack gap-3">
        @csrf

        <div class="col-12 mb-3">
            <label for="files[]">Files</label>
            <input type="file" multiple class="form-control @error('files[]') is-invalid @enderror" id="files[]"
                name="files[]" value="{{old('files[]')}}">
            <div class="invalid-feedback">{{$errors->first('files[]')}}</div>
        </div>

        <button class="btn btn-primary" type="submit">Import</button>
    </form>

@endsection