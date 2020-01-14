# node_express_mySQL
sequelize를 이용한 ORM RESTful연습 프로젝트입니다.

# 기능
User
- 회원가입
- 로그인
- 회원정보 변경하기
- 비밀번호 찾기
- 세션값 유지하기(JWT)
- 비밀번호 암호화(bcryto)
- 구글로그인(passport)
- 자신이 작성한 글 모아보기
- 자신이 좋아요한 글 모아보기

Board
- 게시글 모두보기
- 게시글 보기
- 게시글 삭제하기
- 게시글 수정하기
- 페이지네이션

Comment
- 댓글 달기
- 댓글 삭제하기
- 댓글 수정하기

Like
- 좋아요 Toggle



## Model
User:
- email : String/unique/정규식
- name : String
- phone : String
- bio : Text
- password : String
- salt : String
- login_type : enum[local/google/facebook/naver]
- create_at : date
```
CREATE TABLE squelize_DB.users(
id INT NOT NULL AUTO_INCREMENT,
name VARCHAR(20) NOT NULL,
email VARCHAR(80) NOT NULL UNIQUE,
phone VARCHAR(50),
bio TEXT,
password VARCHAR(100) NOT NULL,
salt VARCHAR(100) NOT NULL,
login_type SET('local', 'google', 'facebook', 'naver'),
create_at DATETIME NOT NULL DEFAULT now(),
PRIMARY KEY(id),
UNIQUE INDEX name_UNIQUE (name ASC))

```
Board
- title : string
- content : string
- img : string
- writer : ref(User)
- active : enum[true/false] // 1:true/2:false
- create_at : date
- update_at : date

Comment
- content : string
- board : ref(Board)
- comment_writer : ref(User)
- ref_comment: ref(Comment)
- create_at : date
- update_at : date

Like
- like_user : ref(User)
- like_board : ref(Board)

## 해야할 작업
1. mySQL 데이터베이스 구축하기 및 연동

## 추가한 패키지
- s